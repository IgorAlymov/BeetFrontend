import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Dialog } from '../models/dialog';
import { User } from '../models/user';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  public searchText:string;
  public searchButtonView:boolean=false;
  public foundDialogs:Dialog[]=[];
  public allDialogsCopy:Dialog[]=[];
  public dialogs:Dialog[]=[];
  public activeUser:User=new User();

  constructor(private dataService:DataService,
              private messageService:MessageService) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser = data);
    this.messageService.getMyDialogs().subscribe((data:Dialog[])=>this.fillingDialogs(data));

    this.messageService.hubConnection.on('sendToAll', (nick: string, receivedMessage: string,idD:string) => {
      this.dialogs.forEach(element => {
        if(element.author==parseInt(nick) && element.reciver==this.activeUser.socialUserId && element.dialogId == parseInt(idD) || 
          element.reciver==parseInt(nick) && element.author==this.activeUser.socialUserId && element.dialogId == parseInt(idD)){
          element.lastMessage=receivedMessage;
          element.date=new Date();
          if(element.author==this.activeUser.socialUserId){
            element.read=false;
          }else{
            element.read=false;
          }
        }
      });
    });
  }

  fillingDialogs(dialogs:Dialog[]){
    dialogs.forEach(element => {
      if(element.author!=this.activeUser.socialUserId){
        this.dataService.getUser(element.author).subscribe((data:User)=> { element.name = data.firstname + " " +  data.lastname });
        this.dataService.getAvatarUser(element.author).subscribe((data:any)=> { element.avatar = data.avatarUrl });
        element.page=element.author;
        element.lastMessage=element.lastMessage.slice(0,70);
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
        element.lastMessage=element.lastMessage.slice(0,70);
        if(element.author==this.activeUser.socialUserId){
          element.read=element.readAuthor;
        }else{
          element.read=element.readReciver;
        }
      }
    });
    this.dialogs=dialogs;
    this.allDialogsCopy=dialogs;
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.dialogs=this.allDialogsCopy;
  }

  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.dialogs=this.allDialogsCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  searchingText(textSearch:string){
    this.foundDialogs=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.allDialogsCopy.forEach(element => {
      let name = element.name;
      let textName=name.toLowerCase().split(" ");
      for( let i = 0; i < textName.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textName[i]){
            this.foundDialogs.push(element);
          }
        }
      }
    });
    this.dialogs=this.foundDialogs;
  }

  deleteDialog(idD:number){
    for(let i = 0; i < this.dialogs.length; i++) {
      if(this.dialogs[i].dialogId==idD)
      this.dialogs.splice(i,1);
    }
    this.messageService.deleteDialog(idD).subscribe();
  }
}
