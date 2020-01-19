import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserReg } from './models/userReg';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userUrl="http://localhost:5001/api/";

  constructor(private http:HttpClient) { }

  public postRegistration(userReg:UserReg) {
    return this.http.post(this.userUrl+"Register",userReg)
  }

  public postEntry(userEntry:UserReg) {
    return this.http.post(this.userUrl+"SignIn",userEntry)
  }

  public signOut(){
    return this.http.get(this.userUrl+"SignOut");
  }
}
