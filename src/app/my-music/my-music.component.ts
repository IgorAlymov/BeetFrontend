import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { MusicService } from '../music.service';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.component.html',
  styleUrls: ['./my-music.component.css']
})
export class MyMusicComponent implements OnInit {

  public musicCounter:number=0;
  public user:User=new User();
  public files: any=null;
  public allMusic:any[]=[];
  public avatarImage:string;
  public percentDone:number;
  public musicPlay:string;
  public musicName:string;

  constructor(private dataService:DataService,
    private musicService:MusicService) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => {
      this.user=data;
      this.musicService.getAllMusic(data.socialUserId).subscribe((data:any) => {
        if(data){
          this.allMusic=data;
          this.allMusic.reverse().forEach(element => {
            this.musicPlay=element.path;
            this.musicName=element.name;
            return;
          });
        }
      });
      this.musicService.getAllMusic(data.socialUserId).subscribe((data:any) => this.musicCounter = data.length);
    });
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
  }

  addMusic(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    if (this.files) {
      let files :FileList = this.files;
      const formData = new FormData();
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
      
      this.musicService.addMusic(formData)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === HttpEventType.Response) {
          this.musicService.getAllMusic(this.user.socialUserId).subscribe((data:any)=>this.allMusic = data.reverse());
          this.musicService.getAllMusic(this.user.socialUserId).subscribe((data:any) => this.musicCounter = data.length);
          this.files=null;
          this.percentDone=0;
        }
      });
    }
  }

  deleteMusic(musicId:number){
    for(let i = 0; i < this.allMusic.length; i++){
      if(this.allMusic[i].musicId==musicId)
      this.allMusic.splice(i,1);
    }
    this.musicService.deleteMusic(musicId).subscribe(p=>{
      this.musicService.getAllMusic(this.user.socialUserId).subscribe((data:any) => this.musicCounter = data.length);
    });
  }

  playMusic(path:string,name:string){
    this.musicPlay=path;
    this.musicName=name;
  }
}
