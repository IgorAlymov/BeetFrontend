import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../models/user';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router'
import { Subscription } from 'rxjs';
import { DialogDataExampleDialogVideo } from '../my-video/my-video.component';
import { VideoService } from '../video.service';
import { MusicService } from '../music.service';
import { AppComponent } from '../app.component';

export interface DialogData {
  avatarImage:string;
  image:string;
  activeUser:User;
}
export interface DialogDataVideo {
  video:any;
  activeUser:User;
  avatarImage:string;
}

@Component({
  selector: 'app-friend-page',
  templateUrl: './friend-page.component.html',
  styleUrls: ['./friend-page.component.css']
})
export class FriendPageComponent implements OnInit{
  public idSub:number;
  public activeUser:User=new User();
  public user:User=new User();
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
  public textPost:string;
  public imageUrl: string;
  public textPostFull:boolean=false;
  public photoPostFull:boolean=false;
  public likeIcons:string[]=["favorite_border","favorite"];
  public likeIconActive:string;
  public likesAllPosts:FileList[];
  public subscription: any;
  public allSub:any[]=[];
  public allCom:any[]=[];
  public allVideo:any[]=[];
  public allMusic:any[]=[];
  public videoCounter:number=0;
  private subscriptions: Subscription;
  public avatarActUser: string;
  public musicCounter:number=0;

  constructor(private dataService:DataService,
    public dialog: MatDialog,
    private router:Router,
    private appCom:AppComponent,
    private activatedRoute:ActivatedRoute,
    private serviceVideo:VideoService,
    private musicService:MusicService) {
  }

  ngOnInit() {
    this.idSub= this.activatedRoute.snapshot.params['id'];
    this.dataService.getUser(this.idSub).subscribe((data:User) => this.fillingArray(data));
    this.dataService.getActiveUser().subscribe((data:User) => this.user=data);
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarActUser=data.avatarUrl);
    this.dataService.getSub(this.idSub).subscribe((data:any) => this.subscription=data);
    this.dataService.getSubscruptionFriends(this.idSub).subscribe((data) => this.getAvatarFriend(data));
    this.dataService.getAvatarUser(this.idSub).subscribe((data:any)=>this.avatarImage=data.avatarUrl);
    this.dataService.getPhotosFriend(this.idSub).subscribe((data:any)=> this.allPhotoLength = data.listPhoto.length);
    this.dataService.getFriendPost(this.idSub).subscribe((data:any[])=>this.getPosts(data));
  }

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

  getPosts(posts:any[]){
    this.userPosts=[];
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

  updatePage(idF:number){
    if(this.user.socialUserId!=idF){
      this.subscriptions = this.activatedRoute.params.subscribe(
        params=>
        {
          if(this.idSub!=Number(params['id']))
          this.ngOnInit();
        }
      );
    }
    else
    this.router.navigate(['/mypage']);
  }

  public update(){
    this.ngOnInit();
  }
  
  showFullInformation(){
    if(!this.fullInformation)
    this.fullInformation=true;
    else
    this.fullInformation=false;
  }

  fillingArray(user:User){
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
    this.serviceVideo.getAllVideo(this.activeUser.socialUserId).subscribe((data:any) => this.getVideo(data));
    this.serviceVideo.getAllVideo(this.activeUser.socialUserId).subscribe((data:any) => this.videoCounter = data.length);
    this.musicService.getAllMusic(this.activeUser.socialUserId).subscribe((data:any) => {
      this.getMusic(data);
      this.musicCounter = data.length;
      this.appCom.playList=data;
    });
  }

  openDialog(image:string):void {
    const dialogRef = this.dialog.open(FriendAvatarDialog, {
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

   addSubscriber(idF:number){
    this.dataService.addSubscriber(idF).subscribe(
       p=> this.subscription=true
    );
  }

  deleteSubscriber(idF:number){
    this.dataService.deleteSubscriber(idF).subscribe(
        p=> this.subscription=false
    );
  }
  
   //Видео
   getVideo(videos:any){
    this.allVideo=[];
    for(let i = 0; i < 2; i++){
      if(videos[i]!=null)
      this.allVideo.push(videos[i]);
    }
   }

   openVideoDialog(video:any):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogSubscriber, {
      data: {
        activeUser:this.activeUser,
        avatarImage:this.avatarImage,
        video:video
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //музыка
  getMusic(music:any){
    this.allMusic=[];
    for(let i = 0; i < 3; i++){
      if(music[i]!=null){
        music[i].name=music[i].name.slice(0,20);
        this.allMusic.push(music[i]);
      }
    }
  }

  playMusic(path:string,name:string){
    this.appCom.musicPlay=path;
    this.appCom.musicName=name;
    this.appCom.iconPlayer="pause";
  }
}

@Component({
  selector: 'friend-avatar-dialog',
  templateUrl: 'friend-avatar-dialog-dialog.html',
})
export class FriendAvatarDialog {
  constructor(public dialogRef: MatDialogRef<FriendAvatarDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  friendPageClick(){
    location.reload();
  }
}

@Component({
  selector: 'dialog-data-example-dialog-video-subscriber',
  templateUrl: 'dialog-data-example-dialog-video-subscriber.html',
})
export class DialogDataExampleDialogSubscriber {

  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogSubscriber>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataVideo,videoService:VideoService) {
      videoService.addViewVideo(data.video.videoId).subscribe();
      data.video.viewCounter++;
    }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  myPageClick(){
    location.reload();
  }
}
