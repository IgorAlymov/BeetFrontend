import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Message } from './models/message';
import { Observable } from 'rxjs';
import { Dialog } from './models/dialog';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public hubConnection: HubConnection = new HubConnectionBuilder().withUrl("http://localhost:5001/chat").build();
  private userUrl="http://localhost:5001/api/";
  headers:any={ headers: new HttpHeaders(), withCredentials: true };
  public connection:boolean=false;

  constructor(private http:HttpClient) { }
  
  public connectionHub(){
    this.hubConnection
      .start()
      .then(() => 
      {
        console.log('Connection chat!');
        this.connection=true;
      })
      .catch(err => console.log('Error chat!'));
  }
  
  public unconnectionHub(){
    this.hubConnection
      .stop()
      .then(() => {
        console.log('Chat stop!');
        this.connection=false;
      });
  }

  public sendMessageHub(nick:string,textMes:string,idD:string,idReciver:string){
    this.hubConnection
      .invoke('sendToAll', nick, textMes,idD,idReciver)
      .catch(err => console.error(err));
  }

  public sendMessage(message:Message){
    return this.http.post(this.userUrl+"SendMessage",message,this.headers)
  }

  public getMyDialogs():Observable<any>{
    return this.http.get(this.userUrl + "GetMyDialogs",this.headers);
  }

  public deleteDialog(idD:number){
    return this.http.get(this.userUrl + "DeleteDialog/ "+ idD,this.headers);
  }

  public getDialog(idD:number):any{
    return this.http.get(this.userUrl+"GetDialog/" + idD,this.headers);
  }

  public getMessages(idD:number):Observable<any>{
    return this.http.get(this.userUrl+"GetMessages/"+ idD,this.headers);
  }
}
