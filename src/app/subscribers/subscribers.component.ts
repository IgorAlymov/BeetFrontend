import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FriendPageComponent } from '../friend-page/friend-page.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  public searchText:string;
  public searchButtonView:boolean=false;
  public allSub:any[];
  public foundUsers:any[]=[];
  public allSubCopy:any[];

  constructor(private dataService:DataService,private router:Router) {
   }

  ngOnInit() {
    this.dataService.getSubscribers().subscribe((data) => this.getAvatarFriend(data));
  }

  getAvatarFriend(subscribers:any[]){
    subscribers.forEach(element => {
      element.avatar=this.dataService.getAvatarUser(element.socialUserId).subscribe((data:any)=>element.avatar=data.avatarUrl),
      element.subscription=this.dataService.getSub(element.socialUserId).subscribe((data:any) => element.subscription=data);
    });
    this.allSub=subscribers;
    this.allSubCopy=subscribers;
    console.log(this.allSub);
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.allSub=this.allSubCopy;
  }

  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.allSub=this.allSubCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  searchingText(textSearch:string){
    this.foundUsers=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.allSubCopy.forEach(element => {
      let userName = element.firstname +" " +element.lastname;
      let textName=userName.toLowerCase().split(" ");
      for( let i = 0; i < textName.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textName[i]){
            this.foundUsers.push(element);
          }
        }
      }
    });
    this.allSub=this.foundUsers;
  }

  addSubscriber(idF:number){
    this.dataService.addSubscriber(idF).subscribe(
      p => this.allSub.forEach(element => {
        if(element.socialUserId==idF)
        element.subscription=true;
      })
    );
  }

  deleteSubscriber(idF:number){
    this.dataService.deleteSubscriber(idF).subscribe(
      p1 => {for(let i = 0; i < this.allSub.length; i++) {
            if(this.allSub[i].socialUserId==idF)
            this.allSub.splice(i,1);
        }
      }
    );
  }
}
