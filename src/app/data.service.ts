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

  public getAllUsers():Observable<any> {
    return this.http.get(this.userUrl + "GetAllUsers",this.headers);
  }

  public addSubscriber(idF:number){
    return this.http.get(this.userUrl +"GetAddNewFriend/" + idF,this.headers)
  }

  public deleteSubscriber(idF:number){
    return this.http.get(this.userUrl +"GetRemoveFriend/" + idF,this.headers)
  }

  public getSub(idF:number):Observable<any>{
    return this.http.get(this.userUrl +"getFriend/" + idF,this.headers)
  }

  public getSubscribers():Observable<any>{
    return this.http.get(this.userUrl +"getFriends/" ,this.headers)
  }

  public getSubscruptionFriends(id:number):Observable<any>{
    return this.http.get(this.userUrl +"GetSubscruptionFriends/"+id ,this.headers)
  }

  public getPhotosFriend(idF:number):Observable<any>{
    return this.http.get(this.userUrl+"GetFriendPhoto/"+idF,this.headers);
  }

  public getFriendPost(idF:number):Observable<any> {
    return this.http.get(this.userUrl + "GetFriendPost/"+idF,this.headers);
  }

  public addCommunity(text:string,formData:FormData){
    const params = new HttpParams().set('', text);
    return this.http.post(this.userUrl + "PostAddGroup/" + params.toString(),formData , this.headers);
  }

  public getAllCommunity():Observable<any>{
    return this.http.get(this.userUrl + "GetAllGroups",this.headers);

  }

  public getAvatarCommunity(idF:number){
    return this.http.get(this.userUrl+"GetImageGroup/"+idF,this.headers);
  }

  public subscribesCommunity(id:number){
    return this.http.get(this.userUrl +"AddGroupSubscriber/" + id,this.headers)
  }

  public deleteCommunity(id:number){
    return this.http.get(this.userUrl +"RemoveGroupSubscriber/" + id,this.headers)
  }

  public getCommunitySubscribers(id:number):Observable<any>{
    return this.http.get(this.userUrl + "GetSubscribers/"+ id,this.headers);
  }

  public getSubscription(id:number){
    return this.http.get(this.userUrl + "GetSubscription/"+ id,this.headers);
  }

  public getMyCommunities(id:number):Observable<any>{
    return this.http.get(this.userUrl + "GetMyGroups/" + id,this.headers);
  }

  public getCommunity(id:number){
    return this.http.get(this.userUrl + "GetCommunity/" + id,this.headers);
  }

  public getMyCommunity(){
    return this.http.get(this.userUrl + "GetMyGroup",this.headers);
  }

  public addGroupPost(id:number,text:string,formData:FormData){
    const params = new HttpParams().set('', text);
    return this.http.post(this.userUrl + "AddPostGroup/" + id +"/" + params.toString(),formData , this.headers);
  }

  public getGroupPost(idF:number):Observable<any> {
    return this.http.get(this.userUrl + "GetGroupPost/"+idF,this.headers);
  }

  public getAllGroupPosts():Observable<any> {
    return this.http.get(this.userUrl + "GetAllGroupPosts",this.headers);
  }

}
