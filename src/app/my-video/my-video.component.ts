import { Component, OnInit, Inject } from '@angular/core';
import { VideoService } from '../video.service';
import { DataService } from '../data.service';
import { User } from '../models/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpEvent, HttpEventType } from '@angular/common/http';

export interface DialogData {
  video:any;
  activeUser:User;
  avatarImage:string;
}

@Component({
  selector: 'app-my-video',
  templateUrl: './my-video.component.html',
  styleUrls: ['./my-video.component.css']
})
export class MyVideoComponent implements OnInit {

  public videoCounter:number=0;
  public user:User=new User();
  public files: any=null;
  public allVideo:any[]=[];
  public avatarImage:string;
  public percentDone:number;

  constructor(private serviceVideo:VideoService,
    private dataService:DataService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => {
      this.user=data;
      this.serviceVideo.getAllVideo(data.socialUserId).subscribe((data:any) => this.allVideo = data);
      this.serviceVideo.getAllVideo(data.socialUserId).subscribe((data:any) => this.videoCounter = data.length);
    });
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
  }

  addVideo(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    if (this.files) {
      let files :FileList = this.files;
      const formData = new FormData();
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
      
      this.serviceVideo.addVideo(formData)
      .subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === HttpEventType.Response) {
          this.serviceVideo.getAllVideo(this.user.socialUserId).subscribe((data:any)=>this.allVideo=data);
          this.serviceVideo.getAllVideo(this.user.socialUserId).subscribe((data:any) => this.videoCounter = data.length);
          this.files=null;
          this.percentDone=0;
        }
      });
    }
  }

  openDialog(video:any):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogVideo, {
      data: {
        activeUser:this.user,
        avatarImage:this.avatarImage,
        video:video
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.serviceVideo.getAllVideo(this.user.socialUserId).subscribe((data:any)=> {
        if(this.allVideo.length!=data.length){
          this.allVideo=data;
          this.serviceVideo.getAllVideo(this.user.socialUserId).subscribe((data:any) => this.videoCounter = data.length);
        }
      })
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog-video',
  templateUrl: 'dialog-data-example-dialog-video.html',
})
export class DialogDataExampleDialogVideo {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogVideo>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private videoService:VideoService) {
      this.videoService.addViewVideo(data.video.videoId).subscribe();
      data.video.viewCounter++;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeVideo(videoId:number){
    this.videoService.deleteVideo(videoId).subscribe( p=> this.dialogRef.close());
  }
}
