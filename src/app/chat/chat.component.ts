import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { User } from '../models/user';
import { Message } from '../models/message';
import { MessageService } from '../message.service';
import { Dialog } from '../models/dialog';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;
  public textMes:string="";
  public idReciver:number;
  public reciver:User=new User();
  public activeUser:User=new User();
  public avatarReciver:string;
  public nick:string;
  public sendMes:Message=new Message();
  public dialog:Dialog;
  public messages:Message[]=[];
  public messagesCopy:Message[]=[];
  public avatarActiveUser: string;
  public searchView:boolean=false;
  public searchText:string;
  public searchButtonView:boolean=false;
  public foundMes:any[]=[];
  public counter:number=null;

  constructor(private router:Router,
              private dataService:DataService,
              private appCom:AppComponent,
              private activatedRoute:ActivatedRoute,
              private messageService:MessageService) { }

  ngOnInit() {
    this.idReciver= this.activatedRoute.snapshot.params['id'];
    this.dataService.getAvatarUser(this.idReciver).subscribe((data:any) => this.avatarReciver=data.avatarUrl);
    this.dataService.getAvatarActiveUser().subscribe((data:any) => this.avatarActiveUser=data.avatarUrl);
    this.dataService.getUser(this.idReciver).subscribe((data:any) => this.reciver = data);
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser = data);
    this.dataService.getActiveUser().subscribe((data:User) => this.nick = data.socialUserId.toString());
    this.messageService.getDialog(this.idReciver).subscribe((data:Dialog)=>this.dialog=data);
    this.messageService.getMessages(this.idReciver).subscribe((data:Message[])=>this.handleDialogs(data));
    this.scrollToBottom();
    this.messageService.hubConnection.on('sendToAll', (nick: string, receivedMessage: string,idD:string) => {
      if(this.dialog && this.dialog.dialogId==parseInt(idD)){
        this.messageService.getDialog(this.idReciver).subscribe((data:Dialog)=>this.dialog=data),
        this.addMessage(receivedMessage,parseInt(nick))
      }else if(this.dialog==null){
        this.addMessage(receivedMessage,parseInt(nick))
      }
    });
    this.appCom.idD=null;
  }

  handleDialogs(data:Message[]){
    this.messages=data;
    this.messagesCopy=data;
    this.messageService.getMyDialogs().subscribe((data:Dialog[])=>this.fillingDialogs(data));
  }

  fillingDialogs(dialogs:Dialog[]){
    dialogs.forEach(element => {
      if(element.author!=this.activeUser.socialUserId){
        this.dataService.getUser(element.author).subscribe((data:User)=> { element.name = data.firstname + " " +  data.lastname });
        this.dataService.getAvatarUser(element.author).subscribe((data:any)=> { element.avatar = data.avatarUrl });
        element.page=element.author;
        if(element.author==this.activeUser.socialUserId){
          element.read=element.readAuthor;
        }else{
          element.read=element.readReciver;
        }
      }
      else{
        this.dataService.getUser(element.reciver).subscribe((data:User)=> {element.name =  data.firstname + " " +  data.lastname});
        this.dataService.getAvatarUser(element.reciver).subscribe((data:any)=> { element.avatar = data.avatarUrl });
        element.page=element.reciver;
        if(element.author==this.activeUser.socialUserId){
          element.read=element.readAuthor;
        }else{
          element.read=element.readReciver;
        }
      }
    });
    dialogs.forEach(element => {
      if(element.read==false)
        this.counter++;
    });
    this.appCom.dialogReadCounter=this.counter;
  }

  sendMessage(): void {
    if(this.textMes!=""){
      if(this.dialog==null){
        this.messageService.sendMessageHub(this.nick, this.textMes,"null",this.idReciver.toString());
        this.sendMes.dialogId=null;
      }
      else{
        this.sendMes.dialogId=this.dialog.dialogId;
        this.messageService.sendMessageHub(this.nick, this.textMes,this.dialog.dialogId.toString(),"null");
      }
      this.sendMes.text=this.textMes;
      this.sendMes.author=this.activeUser.socialUserId;
      this.sendMes.reciver=this.idReciver;
      this.messageService.sendMessage(this.sendMes).subscribe(p=> {
        this.messageService.getDialog(this.idReciver).subscribe((data:Dialog)=>this.dialog=data);
        this.messageService.getMyDialogs().subscribe((data:Dialog[])=>this.appCom.dialogs=data);
      }
      );
      this.textMes="";
    }
  }

  addMessage(message:string,idAuthor:number){
    this.messageService.getDialog(this.idReciver).subscribe((data:Dialog)=>this.dialog=data);
    if(this.messages==null){
      this.messages=[];
    }
    var mes=new Message();
    mes.text=message;
    mes.date=new Date();
    if(idAuthor==this.activeUser.socialUserId){
      mes.name=this.activeUser.firstname+ " " +this.activeUser.lastname;
      mes.avatar=this.avatarActiveUser;
    }
    else{
      mes.name=this.reciver.firstname+ " " +this.reciver.lastname;
      mes.avatar=this.avatarReciver;
    }
    this.messages.push(mes);
  }

  changeText(text){
    
   }

   userPage(idUser:number){
    if(this.activeUser.socialUserId!=idUser){
      this.router.navigate(['/friendpage',idUser]);
    }
    else
      this.router.navigate(['/mypage']);
   }

   ngAfterViewChecked() {        
       this.scrollToBottom();        
   } 

   scrollToBottom(): void {
       try {
           this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
       } catch(err) { }                 
   }

   //поиск
  showSearch(){
    if(this.searchView)
    this.searchView=false
    else
    this.searchView=true;
    this.messages=this.messagesCopy;
  }
  
  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.messages=this.messagesCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.messages=this.messagesCopy;
  }

  searchingText(textSearch:string){
    this.foundMes=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.messagesCopy.forEach(element => {
      let textElement=element.text.toLowerCase().split(" ");
      for( let i = 0; i < textElement.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textElement[i]){
            this.foundMes.push(element);
          }
        }
      }
    });
    this.messages=this.foundMes;
  }
}
