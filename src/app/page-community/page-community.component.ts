import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogData } from '../friend-page/friend-page.component';
import { User } from '../models/user';

@Component({
  selector: 'app-page-community',
  templateUrl: './page-community.component.html',
  styleUrls: ['./page-community.component.css']
})
export class PageCommunityComponent implements OnInit {

  community:any=false;
  idCom:number;
  subscribers:any[]=[];
  activeUser:User=new User();
  adminGroup:User=new User();
  public posts:any[];
  public likeIcons:string[]=["favorite_border","favorite"];
  public likeIconActive:string;
  public avatarImage:string;

  constructor(private dataService:DataService,public dialog: MatDialog,private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.idCom= this.activatedRoute.snapshot.params['id'];
    this.dataService.getGroupPost(this.idCom).subscribe((data:any[]) => this.getPosts(data));
    this.dataService.getCommunity(this.idCom).subscribe((data) => this.getAvatarCommunity(data));
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser=data);
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
  }

  pageFriend(idF:number){
    if(this.activeUser.socialUserId!=idF){
      this.router.navigate(['/friendpage',idF]);
    }
    else
    this.router.navigate(['/mypage']);
  }

  getAvatarCommunity(community:any){
    community.avatar = this.dataService.getAvatarCommunity(community.groupId).subscribe((data:any)=>community.avatar=data.avatarUrl);
    community.subscribersLength = this.dataService.getCommunitySubscribers(community.groupId).subscribe((data:any) => community.subscribersLength=data.length),
    community.subscribers = this.dataService.getCommunitySubscribers(community.groupId).subscribe((data:any) => this.getAvatarSubscribers(data)),
    community.subscription = this.dataService.getSubscription(community.groupId).subscribe((data:any) => community.subscription=data)
    this.dataService.getUser(community.authorId).subscribe((data:User) => this.getAdminAvatar(data));
    this.community=community;
  }

  getAdminAvatar(admin:any){
    this.dataService.getAvatarUser(admin.socialUserId).subscribe((data:any) => admin.avatar=data.avatarUrl);
    this.adminGroup=admin;
  }

  getAvatarSubscribers(subscribers:any){
    this.subscribers=[];
    subscribers.forEach(element => {
      element.avatar=this.dataService.getAvatarUser(element.socialUserId).subscribe((data:any)=>element.avatar=data.avatarUrl)
    });

    for(let i = 0; i < 3; i++){
      if(subscribers[i]!=null)
      this.subscribers.push(subscribers[i]);
    }
  }

  openDialog(image:string,idC:number):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogCom, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {
        avatarImage:this.community.avatar,
        image:image,
        activeCom:this.community,
        idC:idC}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addSubscriber(idF:number){
    this.dataService.subscribesCommunity(idF).subscribe(
      p=> {
        this.community.subscription=true;
        this.dataService.getCommunitySubscribers(this.community.groupId).subscribe((data:any) => this.getAvatarSubscribers(data));
        this.community.subscribersLength=this.dataService.getCommunitySubscribers(this.community.groupId).subscribe((data:any) => this.community.subscribersLength=data.length);
      }
    );
    

  }

  deleteSubscriber(idF:number){
    this.dataService.deleteCommunity(idF).subscribe(
      p=> {
        this.community.subscription=false;
        this.dataService.getCommunitySubscribers(this.community.groupId).subscribe((data:any) => this.getAvatarSubscribers(data));
        this.community.subscribersLength=this.dataService.getCommunitySubscribers(this.community.groupId).subscribe((data:any) => this.community.subscribersLength=data.length);
      }
    );
  }

  openSubscriber(userId:number){
    if(this.activeUser.socialUserId!=userId)
    this.router.navigate(['/friendpage',userId]);
    else
    this.router.navigate(['/mypage']);
  }

  updatePage(){
    this.ngOnInit();
  }
  //посты
  getPosts(posts:any[]){
    
    posts.forEach(element => {
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likeIcon = data.icon),
      element.showComments=false,
      element.textComment="",
      element.showBtnSendCom=false,
      this.dataService.getPostPhoto(element.postId).subscribe((data:any)=>element.photo=data.photoUrl),
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likesCounter = data.likesCounter),
      this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
      this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
    })
    this.posts=posts.reverse();
  }

  deletePost(post:any){
    var i:number; 
    for(i = 0; i < this.posts.length; i++) {
      if(this.posts[i].postId==post.postId){
        this.posts.splice(i,1);
        this.dataService.deletePost(post.postId).subscribe();
      }
    }
   }

   //лайки
  addLike(likeIcon:string,idPost:number,post:any){
     
    if(this.likeIcons[0]==likeIcon){
        this.posts.forEach(element => {
          if(element.postId==idPost){
            element.likeIcon=this.likeIcons[1],
            element.likesCounter++
          }
        });
        this.dataService.addLikePost(idPost).subscribe();
      }
    else{
        this.posts.forEach(element => {
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
        this.posts.forEach(element => {
          if(element.postId==post.postId){
            element.showComments=true;
          }
        });
      }else{
        this.posts.forEach(element => {
          if(element.postId==post.postId){
            element.showComments=false;
          }
        });
      }
     }
  
     changeComment(post:any){
      if(post.textComment==""){
        this.posts.forEach(element => {
          if(element.postId==post.postId){
            element.showBtnSendCom=false;
          }
        });
      }else{
        this.posts.forEach(element => {
          if(element.postId==post.postId){
            element.showBtnSendCom=true;
          }
        });
      }
     }
  
     addComment(post:any){
       let text =post.postId+" "+post.textComment;
       this.dataService.addComment(text).subscribe(
         p=> this.posts.forEach(element => {
        if(element.postId==post.postId){
          element.textComment="";
          this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
          this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
        }
       })
      );
     }
  
     deleteComment(comment:any){
       for(let i = 0; i < this.posts.length; i++) {
        if(this.posts[i].postId==comment.postId){
          for(let j = 0; j < this.posts[i].Comments.length; j++)
          if(this.posts[i].Comments[j].commentId==comment.commentId){
            this.posts[i].Comments.splice(j,1);
            this.dataService.deleteComment(comment.commentId).subscribe(p=>
              this.posts.forEach(element => {
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
      this.posts.forEach(element => {
        if(element.postId==post.postId){
          element.textComment="";
          element.showBtnSendCom=false;
        }
      });
     }
}

@Component({
  selector: 'dialog-data-example-dialog-com',
  templateUrl: 'dialog-data-example-dialog-com.html',
})
export class DialogDataExampleDialogCom {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogCom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  onNoClick(): void {
    this.dialogRef.close();
    location.reload();
  }
}
