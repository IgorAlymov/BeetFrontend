import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private userUrl="http://localhost:5001/api/"
  headers:any={ headers: new HttpHeaders(), withCredentials: true };

  constructor(private http:HttpClient) { }

  public postRegistration(userReg:User) {
    return this.http.post(this.userUrl+"Register",userReg,this.headers)
  }

  public postEntry(userEntry:User) {
    return this.http.post(this.userUrl+"SignIn",userEntry,this.headers)
  }

  public signOut(){
    return this.http.get(this.userUrl+"SignOut",this.headers);
  }

  public getActiveUser():Observable<any> {
    return this.http.get(this.userUrl+"GetActiveUser", this.headers);
  }

  public sendAvatarPhoto(formData:FormData){
    return this.http.post(this.userUrl+"PostUserPhoto",formData,this.headers);
  }

  public getAvatarActiveUser(){
    return this.http.get(this.userUrl+"GetUserAvatar",this.headers);
  }
}
