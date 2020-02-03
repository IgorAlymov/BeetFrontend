import { Component, OnInit,Inject } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../models/user';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  avatarImage:string;
  activeUser:User;
}

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {
  public activeUser:User=new User();
  public fullInformation:boolean=false;
  public showBirthday:boolean=false;
  public files: any;
  public avatarImage:string;
  public allPhotoLength:number;

  constructor(private dataService:DataService,public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.fillingArray(data));
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
    this.dataService.getAllPhotos().subscribe((data:any)=> this.allPhotoLength = data.listPhoto.length);
  }

  showFullInformation(){
    if(!this.fullInformation)
    this.fullInformation=true;
    else
    this.fullInformation=false;
  }

  fillingArray(user:User){
    Object.keys(user).forEach(function(key){
       if(user[key]==null)
       user[key]="Не указано";
    });
    if(user.birthday.toString() == "Не указано")
    this.showBirthday=false;
    else
    this.showBirthday=true;
    this.activeUser=user;
  }

  addAvatar(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    if (this.files) {
      let files :FileList = this.files;
      const formData = new FormData();
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
      this.dataService.sendAvatarPhoto(formData)
      .subscribe(
        p => this.dataService.getAvatarActiveUser()
        .subscribe((data:any)=>this.avatarImage=data.avatarUrl)
      );
    }
  }

  openDialog():void {
    const dialogRef = this.dialog.open(DialogDataExampleDialog, {
      height:"85%",
      maxHeight:"710px",
      minHeight:"710px",
      data: {avatarImage:this.avatarImage,activeUser:this.activeUser}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
