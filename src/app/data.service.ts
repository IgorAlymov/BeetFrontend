import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  public changeSave(user:User) {
    return this.http.post(this.userUrl+"ChangeSave",user,this.headers)
  }
  public deletePage() {
    return this.http.get(this.userUrl+"DeletePage",this.headers)
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

  public getUser(id:number):Observable<any> {
    return this.http.get(this.userUrl+"GetUser/"+id, this.headers);
  }

  public sendAvatarPhoto(formData:FormData){
    return this.http.post(this.userUrl+"PostUserPhoto",formData,this.headers);
  }

  public sendPhoto(formData:FormData){
    return this.http.post(this.userUrl+"PostAddPhoto",formData,this.headers);
  }

  public getAvatarActiveUser(){
    return this.http.get(this.userUrl+"GetUserAvatar",this.headers);
  }

  public getAvatarUser(id:number){
    return this.http.get(this.userUrl+"GetUserAvatar/"+id,this.headers);
  }

  public getAllPhotos():Observable<any>{
    return this.http.get(this.userUrl+"GetAllUserPhoto",this.headers);
  }

  public removePhoto(text:string){
    const params = new HttpParams().set('', text);
    return this.http.get(this.userUrl+"GetRemovePhoto/" + params.toString());
  }

  public addUserPost(text:string,formData:FormData){
    const params = new HttpParams().set('', text);
    return this.http.post(this.userUrl + "PostAddPost/" + params.toString(),formData , this.headers);
  }

  public getActiveUserPost():Observable<any> {
    return this.http.get(this.userUrl + "GetActiveUserPosts",this.headers);
  }

  public getAllPosts():Observable<any> {
    return this.http.get(this.userUrl + "GetAllPosts",this.headers);
  }

  public getPostPhoto(id:number) {
    return this.http.get(this.userUrl+"GetImagePosts/"+id,this.headers);
  }

  public deletePost(id:number){
    return this.http.get(this.userUrl+"GetDeletePost/"+id);
  }

  public addLikePost(id:number){
    return this.http.get(this.userUrl+"AddLikePost/"+id,this.headers);
  }

  public getLikePost(id:number):Observable<any>{
    return this.http.get(this.userUrl+"GetLikePost/"+id,this.headers);
  }

  public removeLikePost(id:number){
    return this.http.get(this.userUrl+"RemoveLikePost/"+id,this.headers);
  }

  public addComment(text:string){
    const params = new HttpParams().set('', text);
    return this.http.get(this.userUrl+"AddComment/"+params.toString(),this.headers);
  }

  public getComment(id:number):Observable<any>{
    return this.http.get(this.userUrl+"GetComment/"+id,this.headers);
  }

  public deleteComment(id:number){
    return this.http.get(this.userUrl+"GetDeleteComment/"+id);
  }
}
