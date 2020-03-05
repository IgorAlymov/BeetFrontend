import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../models/user';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogData } from '../friend-page/friend-page.component';

@Component({
  selector: 'app-page-my-community',
  templateUrl: './page-my-community.component.html',
  styleUrls: ['./page-my-community.component.css']
})
export class PageMyCommunityComponent implements OnInit {

  community:any=false;
  subscribers:any[]=[];
  activeUser:User=new User();
  adminGroup:User=new User();
  public textPost:string;
  public textPostFull:boolean=false;
  public photoPostFull:boolean=false;
  public filesPostPhotoDisplay: any;
  public filesPostPhoto: any;
  public posts:any[];
  public likeIcons:string[]=["favorite_border","favorite"];
  public likeIconActive:string;
  public avatarImage:string;


  constructor(private dataService:DataService,public dialog: MatDialog,private router:Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.dataService.getMyCommunity().subscribe((data) => this.getAvatarCommunity(data));
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser=data);
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
  }

  getAvatarCommunity(community:any){
    this.dataService.getGroupPost(community.groupId).subscribe((data:any[]) => this.getPosts(data));
    community.avatar = this.dataService.getAvatarCommunity(community.groupId).subscribe((data:any)=>community.avatar=data.avatarUrl);
    community.subscribersLength = this.dataService.getCommunitySubscribers(community.groupId).subscribe((data:any) => community.subscribersLength=data.length),
    community.subscribers = this.dataService.getCommunitySubscribers(community.groupId).subscribe((data:any) => this.getAvatarSubscribers(data)),
    community.subscription= this.dataService.getSubscription(community.groupId).subscribe((data:any) => community.subscription=data)
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

  openDialog(image:string):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogMyCom, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {
        avatarImage:this.community.avatar,
        image:image,
        activeCom:this.community}
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

  changeText(text){
    if(text=="")
     this.textPostFull=false;
    else
     this.textPostFull=true;
   }

   clearPostText(){
    this.textPost="";
    this.textPostFull=false;
   }

   changePhoto(photo){
    if(photo=="")
     this.photoPostFull=false;
    else
     this.photoPostFull=true;
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

  closeSelectPhoto(){
    this.filesPostPhotoDisplay="";
    this.filesPostPhoto="";
    this.photoPostFull=false;
   }

   addGroupPost(text:string){
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
    this.dataService.addGroupPost(this.community.groupId,text,formData)
    .subscribe(
      p => this.dataService.getGroupPost(this.community.groupId).subscribe((data:any[]) => this.getPosts(data))
    );
  }

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
  selector: 'dialog-data-example-dialog-mycom',
  templateUrl: 'dialog-data-example-dialog-mycom.html',
})
export class DialogDataExampleDialogMyCom {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogMyCom>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
