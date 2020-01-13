import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserReg } from './models/userReg';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  private userUrl="http://localhost:5001/api/";

  public postRegistration(userReg:UserReg) {
    return this.http.post(this.userUrl+"Register",userReg)
  }
  public postEntry(userEntry:UserReg) {
    return this.http.post(this.userUrl+"SignIn",userEntry)
  }
}
