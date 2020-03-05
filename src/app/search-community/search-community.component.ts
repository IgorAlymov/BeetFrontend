import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-search-community',
  templateUrl: './search-community.component.html',
  styleUrls: ['./search-community.component.css']
})
export class SearchCommunityComponent implements OnInit {

  public searchText:string;
  public searchButtonView:boolean=false;
  public allCommunity:any[];
  public foundCommunity:any[]=[];
  public allCommunityCopy:any[];
  public activeUser:User=new User();
  public myCommunity:any;

  constructor(private dataService:DataService,private router:Router) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.activeUser=data);
    this.dataService.getMyCommunity().subscribe((data) => this.myCommunity=data);
    this.dataService.getAllCommunity().subscribe((data) => this.getAvatarCommunity(data));
  }

  getAvatarCommunity(allCommunity:any[]){
    allCommunity.forEach(element => {
      element.avatar=this.dataService.getAvatarCommunity(element.groupId).subscribe((data:any)=>element.avatar=data.avatarUrl),
      element.subscribers=this.dataService.getCommunitySubscribers(element.groupId).subscribe((data:any) => element.subscribers=data),
      element.subscription=this.dataService.getSubscription(element.groupId).subscribe((data:any) => element.subscription=data)
    });
    this.allCommunity=allCommunity;
    this.allCommunityCopy=allCommunity;
  }

  changeSearchText(searchText:string){
    if(searchText==""){
      this.searchButtonView=false;
      this.allCommunity=this.allCommunityCopy;
    }
    else{
      this.searchButtonView=true;
    }
  }

  clearSearchText(){
    this.searchText="";
    this.searchButtonView=false;
    this.allCommunity=this.allCommunityCopy;
  }

  searchingText(textSearch:string){
    this.foundCommunity=new Array();
    let text=textSearch.toLowerCase().split(" ");
    this.allCommunityCopy.forEach(element => {

      let name = element.name;
      let textName=name.toLowerCase().split(" ");
      for( let i = 0; i < textName.length; i++) {
        for( let j = 0; j < text.length; j++) {
          if(text[j]==textName[i]){
            this.foundCommunity.push(element);
          }
        }
      }
    });
    this.allCommunity=this.foundCommunity;
  }

  
  subscribesCommunity(idG:number){
    this.dataService.subscribesCommunity(idG).subscribe(
      p => this.allCommunity.forEach(element => {
        if(element.groupId==idG){
          element.subscription=true,
          element.subscribers=this.dataService.getCommunitySubscribers(element.groupId).subscribe((data:any) => element.subscribers=data)
        }
        
      })
    );
  }

  deleteCommunity(idG:number){
    this.dataService.deleteCommunity(idG).subscribe(
      p => this.allCommunity.forEach(element => {
        if(element.groupId==idG){
          element.subscription=false,
          element.subscribers=this.dataService.getCommunitySubscribers(element.groupId).subscribe((data:any) => element.subscribers=data)
        }
      })
    );
  }

  openMyCommunity(){
    if(this.myCommunity){
      this.router.navigate(['/mycommunitypage']);
    }else{
      this.router.navigate(['/mycommunity']);
    }
  }
}
