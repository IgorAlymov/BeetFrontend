import { Component, OnInit} from '@angular/core';
import { DataService } from './data.service';
import { HubConnection } from '@aspnet/signalr';
import { MessageService } from './message.service';
import { User } from './models/user';
import { Dialog } from './models/dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public viewReg:boolean=false;
  public fullView:boolean;
  public activeUser:User=new User();
  public dialogs:Dialog[]=[];
  public dialogReadCounter:number=0;
  public counter:number=0;
  public nick:string=null;
  public dialog:Dialog=new Dialog();
  public idReciver:string=null;
  public idD:number=null;

  constructor(private dataService:DataService,
              private messageService:MessageService) {
    this.messageService.connectionHub();
    this.fullView=true;
    this.dialogReadCounter=null;
  }
   ngOnInit(): void {
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser = data);
    this.messageService.getMyDialogs().subscribe((data:Dialog[])=>this.fillingDialogs(data));
    this.messageService.hubConnection.on('sendToAll', (nick: string, receivedMessage: string,idD:string,idReciver:string) => {
      
      if(this.activeUser && idD=="null" && parseInt(nick)!=this.activeUser.socialUserId && 
      this.activeUser.socialUserId.toString() == idReciver && this.idReciver!=idReciver){
        this.dialogReadCounter++;
        this.idReciver=idReciver;
      }
      if(this.activeUser && this.dialogs){
        
          this.dialogs.forEach(element => {
            console.log(parseInt(idD), element.dialogId);
            if(parseInt(nick)!=this.activeUser.socialUserId && parseInt(nick) ==element.author && parseInt(idD)==element.dialogId && this.idD!=parseInt(idD) || 
                parseInt(nick)!=this.activeUser.socialUserId && parseInt(nick) ==element.reciver && parseInt(idD)==element.dialogId && this.idD!=parseInt(idD)){
                  console.log("заходит1");
                  this.idD=parseInt(idD);
                  this.messageService.getDialog(parseInt(nick)).subscribe(
                    (data:Dialog)=>this.getActiveDialog(data));
            }
        });
      }
    });
  }

  getActiveDialog(data:Dialog){
    console.log(data);
    if(data.author==this.activeUser.socialUserId){
      data.read=data.readAuthor;
    }else{
      data.read=data.readReciver;
    }
    if(data.read==true)
    this.dialogReadCounter++;
  }

  output(){
    this.dataService.signOut()
    .subscribe();
    this.messageService.unconnectionHub();
    this.viewReg=false;
    this.fullView=false;
  }

  fillingDialogs(dialogs:Dialog[]){
    if(dialogs)
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
    this.dialogs=dialogs;
    if(dialogs)
    dialogs.forEach(element => {
      if(element.read==false)
      this.counter++;
    });
    this.dialogReadCounter=this.counter;
  }
}
