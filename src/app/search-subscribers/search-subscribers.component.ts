import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FriendPageComponent } from '../friend-page/friend-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-subscribers',
  templateUrl: './search-subscribers.component.html',
  styleUrls: ['./search-subscribers.component.css']
})
export class SearchSubscribersComponent implements OnInit {
  public searchText:string;
  public searchButtonView:boolean=false;
  public allUsers:any[];
  public foundUsers:any[]=[];
  public allUsersCopy:any[];

  constructor(private dataService:DataService,private router:Router) { }

  ngOnInit() {
    this.dataService.getAllUsers().subscribe((data) => this.getAvatarFriend(data));
  }

  getAvatarFriend(allUsers:any[]){
    allUsers.forEach(element => {
      element.avatar=this.dataService.getAvatarUser(element.socialUserId).subscribe((data:any)=>element.avatar=data.avatarUrl),
      element.subscription=this.dataService.getSub(element.socialUserId).subscribe((data:any) => element.subscription=data);
    });
    this.allUsers=allUsers;
    this.allUsersCopy=allUsers;
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.allUsers=this.allUsersCopy;
  }

  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.allUsers=this.allUsersCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  searchingText(textSearch:string){
    this.foundUsers=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.allUsersCopy.forEach(element => {
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
    this.allUsers=this.foundUsers;
  }

  addSubscriber(idF:number){
    this.dataService.addSubscriber(idF).subscribe(
      p => this.allUsers.forEach(element => {
        if(element.socialUserId==idF)
        element.subscription=true;
      })
    );
  }

  deleteSubscriber(idF:number){
    this.dataService.deleteSubscriber(idF).subscribe(
      p => this.allUsers.forEach(element => {
        if(element.socialUserId==idF)
        element.subscription=false;
      })
    );
  }
}
