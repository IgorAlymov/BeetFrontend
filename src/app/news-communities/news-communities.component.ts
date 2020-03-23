import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../models/user';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DialogData } from '../friend-page/friend-page.component';

@Component({
  selector: 'app-news-communities',
  templateUrl: './news-communities.component.html',
  styleUrls: ['./news-communities.component.css']
})
export class NewsCommunitiesComponent implements OnInit {

  public activeUser:User=new User();
  public comPosts:any[];
  public comPostsCopy:any[];
  public foundPosts:any[]=[];
  public avatarImage:string;
  public likeIcons:string[]=["favorite_border","favorite"];
  public searchText:string;
  public searchButtonView:boolean=false;

  constructor(private dataService:DataService,public dialog: MatDialog,private router:Router) { }

  ngOnInit() {
    this.dataService.getAllGroupPosts().subscribe((data:any[])=>this.getPosts(data));
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

  openDialog(image:string,avatar:string,name:string,idC:number):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogComNews, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {
        avatarImage:avatar,
        image:image,
        activeCom:name,
        idC:idC}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.comPosts=this.comPostsCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  updatePage(){
    this.ngOnInit();
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.comPosts=this.comPostsCopy;
  }

  searchingText(textSearch:string){
    this.foundPosts=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.comPostsCopy.forEach(element => {
      let textElement=element.text.toLowerCase().split(" ");
      let name = element.name;
      let textName=name.toLowerCase().split(" ");
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
    this.comPosts=this.foundPosts;
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
      this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length)
      this.dataService.getAvatarCommunity(element.authorId).subscribe((data:any)=>element.avatar=data.avatarUrl)
      this.dataService.getCommunity(element.authorId).subscribe((data:any)=>element.name=data.name)
    })
    this.comPosts=posts.reverse();
    this.comPostsCopy=posts;
  }

  deletePost(post:any){
    var i:number; 
    for(i = 0; i < this.comPosts.length; i++) {
      if(this.comPosts[i].postId==post.postId){
        this.comPosts.splice(i,1);
        this.dataService.deletePost(post.postId).subscribe();
      }
    }
   }
  //лайки
  addLike(likeIcon:string,idPost:number,post:any){
     
  if(this.likeIcons[0]==likeIcon){
      this.comPosts.forEach(element => {
        if(element.postId==idPost){
          element.likeIcon=this.likeIcons[1],
          element.likesCounter++
        }
      });
      this.dataService.addLikePost(idPost).subscribe();
    }
  else{
      this.comPosts.forEach(element => {
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
      this.comPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showComments=true;
        }
      });
    }else{
      this.comPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showComments=false;
        }
      });
    }
   }

   changeComment(post:any){
    if(post.textComment==""){
      this.comPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showBtnSendCom=false;
        }
      });
    }else{
      this.comPosts.forEach(element => {
        if(element.postId==post.postId){
          element.showBtnSendCom=true;
        }
      });
    }
   }

   addComment(post:any){
     let text =post.postId+" "+post.textComment;
     this.dataService.addComment(text).subscribe(
       p=> this.comPosts.forEach(element => {
      if(element.postId==post.postId){
        element.textComment="";
        this.dataService.getComment(element.postId).subscribe(data=>element.Comments=data),
        this.dataService.getComment(element.postId).subscribe(data=>element.CommentsCounter=data.length);
      }
     })
    );
   }

   deleteComment(comment:any){
     for(let i = 0; i < this.comPosts.length; i++) {
      if(this.comPosts[i].postId==comment.postId){
        for(let j = 0; j < this.comPosts[i].Comments.length; j++)
        if(this.comPosts[i].Comments[j].commentId==comment.commentId){
          this.comPosts[i].Comments.splice(j,1);
          this.dataService.deleteComment(comment.commentId).subscribe(p=>
            this.comPosts.forEach(element => {
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
    this.comPosts.forEach(element => {
      if(element.postId==post.postId){
        element.textComment="";
        element.showBtnSendCom=false;
      }
    });
   }
}

@Component({
  selector: 'dialog-data-example-dialog-comnews',
  templateUrl: 'dialog-data-example-dialog-comnews.html',
})
export class DialogDataExampleDialogComNews {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogComNews>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data);
    }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}