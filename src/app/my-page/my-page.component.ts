import { Component, OnInit,Inject } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../models/user';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subscriber } from 'rxjs';
import { FriendPageComponent } from '../friend-page/friend-page.component';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Dialog } from '../models/dialog';
import { MessageService } from '../message.service';

export interface DialogData {
  avatarImage:string;
  image:string;
  activeUser:User;
}

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {
  public activeUser:User=new User();
  public userPosts:any[];
  public fullInformation:boolean=false;
  public showBirthday:boolean=false;
  public filesAvatar: any;
  public filesPostPhotoDisplay: any;
  public filesPostPhoto: any;
  public avatarImage:string;
  public allPhotoLength:number;
  public allSubLength:number;
  public allComLength:number;
  public textPost:string="";
  public imageUrl: string;
  public textPostFull:boolean=false;
  public photoPostFull:boolean=false;
  public likeIcons:string[]=["favorite_border","favorite"];
  public likeIconActive:string;
  public likesAllPosts:FileList[];
  public allSub:any[]=[];
  public allCom:any[]=[];
  public counter:number=null;

  constructor(private dataService:DataService,
    public dialog: MatDialog,
    private router:Router,
    private appCom:AppComponent,
    private messageService:MessageService) {
      appCom.dialogReadCounter=null;
    }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.fillingArray(data));
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
    this.dataService.getAllPhotos().subscribe((data:any)=> this.allPhotoLength = data.listPhoto.length);
    this.dataService.getSubscribers().subscribe((data) => this.getAvatarFriend(data));
    this.dataService.getActiveUserPost().subscribe((data:any[])=>this.getPosts(data));
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

  updatePage(){
    this.ngOnInit();
  }

  pageFriend(idF:number){
    if(this.activeUser.socialUserId!=idF){
      this.router.navigate(['/friendpage',idF]);
    }
    else
    this.ngOnInit();
  }

 //Сообщества
 getCommunities(communities:any){
  this.allCom=[];
  this.allComLength=communities.length;
  communities.forEach(element => {
    element.avatar=this.dataService.getAvatarCommunity(element.groupId).subscribe((data:any)=>element.avatar=data.avatarUrl),
    element.subscribers=this.dataService.getCommunitySubscribers(element.groupId).subscribe((data:any) => element.subscribers=data)
  });
  for(let i = 0; i < 3; i++){
    if(communities[i]!=null)
    this.allCom.push(communities[i]);
  }
 }
 //подписки
  getAvatarFriend(subscribers:any[]){
    this.allSub=[];
    this.allSubLength=subscribers.length;
    subscribers.forEach(element => {
      element.avatar=this.dataService.getAvatarUser(element.socialUserId).subscribe((data:any)=>element.avatar=data.avatarUrl),
      element.subscription=this.dataService.getSub(element.socialUserId).subscribe((data:any) => element.subscription=data);
    });

    for(let i = 0; i < 3; i++){
      if(subscribers[i]!=null)
      this.allSub.push(subscribers[i]);
    }
  }
  
  //информация о пользователе
  showFullInformation(){
    if(!this.fullInformation)
    this.fullInformation=true;
    else
    this.fullInformation=false;
  }

  fillingArray(user:User){
    this.appCom.activeUser=user;
    Object.keys(user).forEach(function(key){
       if(user[key]==null)
       user[key]="Не указано";
    });
    if(user.birthday.toString() == "Не указано")
    this.showBirthday=false;
    else
    this.showBirthday=true;
    this.activeUser=user;
    this.dataService.getMyCommunities(this.activeUser.socialUserId).subscribe((data) => this.getCommunities(data));
  }
  //аватар
  addAvatar(event) {
    let target = event.target || event.srcElement;
    this.filesAvatar = target.files;
    if (this.filesAvatar) {
      let files :FileList = this.filesAvatar;
      const formData = new FormData();
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
      this.dataService.sendAvatarPhoto(formData)
      .subscribe(
        p => this.dataService.getAvatarActiveUser()
        .subscribe((data:any)=>this.avatarImage=data.avatarUrl)
      );
    }
  }

  openDialog(image:string):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialog, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {
        avatarImage:this.avatarImage,
        image:image,
        activeUser:this.activeUser}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //посты
  getPosts(posts:any[]){
    posts.forEach(element => {
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likeIcon = data.icon),
      element.firstname=this.activeUser.firstname,
      element.lastname=this.activeUser.lastname,
      element.avatar=this.avatarImage,
      element.showComments=false,
      element.textComment="",
      element.showBtnSendCom=false,
      this.dataService.getPostPhoto(element.postId).subscribe((data:any)=>element.photo=data.photoUrl),
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likesCounter = data.likesCounter),
      this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
      this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
    });
    this.userPosts=posts;
  }

  selectPostPhoto(event) {
    let target = event.target || event.srcElement;
    this.filesPostPhoto=target.files;
    this.filesPostPhotoDisplay = target.files;
    let reader = new FileReader(); 
    reader.onload = (e: any) => { 
      this.filesPostPhotoDisplay = e.target.result; 
     } 
     reader.readAsDataURL(event.target.files[0]); 
     this.changePhoto(this.filesPostPhoto);
  }

  addUserPost(text:string){
    const formData = new FormData();
    if (this.filesPostPhoto) {
      let files :FileList = this.filesPostPhoto;
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
    }
    this.filesPostPhoto="";
    this.textPost="";
    this.photoPostFull=false;
    this.textPostFull=false;
    this.dataService.addUserPost(text,formData)
    .subscribe(
      p => this.dataService.getActiveUserPost().subscribe((data:any[])=>this.getPosts(data))
    );
  }

  changeText(text){
   if(text=="")
    this.textPostFull=false;
   else
    this.textPostFull=true;
  }

  changePhoto(photo){
    if(photo=="")
     this.photoPostFull=false;
    else
     this.photoPostFull=true;
   }

   closeSelectPhoto(){
    this.filesPostPhotoDisplay="";
    this.filesPostPhoto="";
    this.photoPostFull=false;
   }

   deletePost(post:any){
    var i:number; 
    for(i = 0; i < this.userPosts.length; i++) {
      if(this.userPosts[i].postId==post.postId){
        this.userPosts.splice(i,1);
        this.dataService.deletePost(post.postId).subscribe();
      }
    }
   }

   clearPostText(){
    this.textPost="";
    this.textPostFull=false;
   }
   //лайки постов
   addLike(likeIcon:string,idPost:number,post:any){
     
    if(this.likeIcons[0]==likeIcon){
      this.userPosts.forEach(element => {
        if(element.postId==idPost){
          element.likeIcon=this.likeIcons[1],
          element.likesCounter++
        }
      });
      this.dataService.addLikePost(idPost).subscribe();
    }
    else{
      this.userPosts.forEach(element => {
        if(element.postId==idPost){
          element.likeIcon=this.likeIcons[0],
          element.likesCounter--
        }
      });
      this.dataService.removeLikePost(idPost).subscribe();
    }
   }
   //комментарии
   showComments(post:any){
    if(!post.showComments){
      this.userPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showComments=true;
        }
      });
    }else{
      this.userPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showComments=false;
        }
      });
    }
   }

   changeComment(post:any){
    if(post.textComment==""){
      this.userPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showBtnSendCom=false;
        }
      });
    }else{
      this.userPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showBtnSendCom=true;
        }
      });
    }
   }

   addComment(post:any){
     let text =post.postId+" "+post.textComment;
     this.dataService.addComment(text).subscribe(
       p=> this.userPosts.forEach(element => {
      if(element.postId==post.postId){
        element.textComment="";
        this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
        this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
      }
     })
    );
   }

   deleteComment(comment:any){
     for(let i = 0; i < this.userPosts.length; i++) {
      if(this.userPosts[i].postId==comment.postId){
        for(let j = 0; j < this.userPosts[i].Comments.length; j++)
        if(this.userPosts[i].Comments[j].commentId==comment.commentId){
          this.userPosts[i].Comments.splice(j,1);
          this.dataService.deleteComment(comment.commentId).subscribe(p=>
            this.userPosts.forEach(element => {
              if(element.postId==comment.postId){
                this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length)
              }
            })
          );
        }
      }
    }
   }

   clearCommentText(post:any){
    this.userPosts.forEach(element => {
      if(element.postId==post.postId){
        element.textComment="";
        element.showBtnSendCom=false;
      }
    });
   }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {

  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  myPageClick(){
    location.reload();
  }
}
