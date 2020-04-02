import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../models/user';
import { Router } from '@angular/router';

export interface DialogData {
  avatarImage:string;
  image:string;
  user:User;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  public activeUser:User=new User();
  public userPosts:any[];
  public userPostsCopy:any[];
  public foundPosts:any[]=[];
  public avatarImage:string;
  public likeIcons:string[]=["favorite_border","favorite"];
  public searchText:string;
  public searchButtonView:boolean=false;

  constructor(private router:Router,private dataService:DataService,public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser=data);  
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
    this.dataService.getAllPosts().subscribe((data:any[])=>this.getPosts(data));
  }

  onPageAuthor(idAuthor:number){
    if(idAuthor!=this.activeUser.socialUserId){
      this.router.navigate(['/friendpage',idAuthor]);
    }else{
      this.router.navigate(['/mypage']);
    }
  }
  //посты
  getPosts(posts:any[]){
    posts.forEach(element => {
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likeIcon = data.icon),
      element.authorPost=this.dataService.getUser(element.authorId).subscribe((data:User) => element.authorPost=data),
      element.avatarAuthor=this.dataService.getAvatarUser(element.authorId).subscribe((data:any)=>element.avatarAuthor=data.avatarUrl),
      element.showComments=false,
      element.textComment="",
      element.showBtnSendCom=false,
      this.dataService.getPostPhoto(element.postId).subscribe((data:any)=>element.photo=data.photoUrl),
      this.dataService.getLikePost(element.postId).subscribe((data)=>element.likesCounter = data.likesCounter),
      this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
      this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
    });
    this.userPosts=posts.reverse();
    this.userPostsCopy=this.userPosts;
  }

  deletePost(post:any){
    for( let i = 0; i < this.userPosts.length; i++) {
      if(this.userPosts[i].postId==post.postId){
        this.userPosts.splice(i,1);
        this.dataService.deletePost(post.postId).subscribe();
      }
    }
   }

   openDialog(image:string,avatar:string,author:User):void {
     console.log(author);
    const dialogRef = this.dialog.open(DialogDataExampleDialogNews, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {
        avatarImage:avatar,
        image:image,
        user:author}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
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
  //поиск
  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.userPosts=this.userPostsCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.userPosts=this.userPostsCopy;
  }

  searchingText(textSearch:string){
    this.foundPosts=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.userPostsCopy.forEach(element => {
      let textElement=element.text.toLowerCase().split(" ");
      let userName = element.authorPost.firstname +" " +element.authorPost.lastname;
      let textName=userName.toLowerCase().split(" ");
      for( let i = 0; i < textElement.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textElement[i]){
            this.foundPosts.push(element);
          }
        }
      }
      for( let i = 0; i < textName.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textName[i]){
            this.foundPosts.push(element);
          }
        }
      }
    });
    this.userPosts=this.foundPosts;
  }
}

@Component({
  selector: 'dialog-data-example-dialog-news',
  templateUrl: 'dialog-data-example-dialog-news.html',
})
export class DialogDataExampleDialogNews {

  activeUser:User=new User();

  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogNews>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService:DataService,
    private router:Router) {
      this.dataService.getActiveUser().subscribe((data:User)=>this.activeUser=data);
    }
  
  onNoClick(): void {

    if(this.activeUser.socialUserId==this.data.user.socialUserId){
      this.router.navigate(['/mypage']);
    }else{
      this.router.navigate(['/friendpage',this.data.user.socialUserId]);
    }
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
