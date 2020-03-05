import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-community',
  templateUrl: './my-community.component.html',
  styleUrls: ['./my-community.component.css']
})
export class MyCommunityComponent implements OnInit {

  public comName:string;
  public comImage:string;
  public filesIamge: any;
  public filesComPhotoDisplay: any;
  public filesComPhoto: any;
  public textComFull:boolean=false;
  public photoComFull:boolean=false;
  public myCommunity:any;

  constructor(private dataService:DataService, private router:Router) { }

  ngOnInit() {
    this.dataService.getMyCommunity().subscribe((data) => this.myCommunity=data);
  }

  selectComPhoto(event) {
    let target = event.target || event.srcElement;
    this.filesComPhoto=target.files;
    this.filesComPhotoDisplay = target.files;
    let reader = new FileReader(); 
    reader.onload = (e: any) => { 
      this.filesComPhotoDisplay = e.target.result; 
     } 
     reader.readAsDataURL(event.target.files[0]); 
     this.changePhoto(this.filesComPhoto);
  }

  changePhoto(photo){
    if(photo=="")
     this.photoComFull=false;
    else
     this.photoComFull=true;
   }

   closeSelectPhoto(){
    this.filesComPhotoDisplay="";
    this.filesComPhoto="";
    this.photoComFull=false;
   }

   clearComText(){
    this.comName="";
    this.textComFull=false;
   }

   changeText(text){
    if(text=="")
     this.textComFull=false;
    else
     this.textComFull=true;
   }

   addCommunity(text:string){
    const formData = new FormData();
    if (this.filesComPhoto) {
      let files :FileList = this.filesComPhoto;
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
    }
    
    this.dataService.addCommunity(text,formData)
    .subscribe(
      p => this.router.navigate(['/mycommunitypage'])
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
