import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { User } from '../models/user';

export interface DialogData {
  image:string;
  activeUser:User;
  avatarImage:string;
  allPhoto:string[][];
  imageIndex:string;
  imageIndexNumb:number;
  photosCounter:number;
}

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})

export class PhotosComponent implements OnInit {
  public photosCounter:number;
  public photos:string;
  public files: any;
  public user:User;
  public avatarImage: any;
  public indexImages:string[][] = new Array();
  
  constructor(private dataService:DataService,public dialog: MatDialog) {
   }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.user=data);
    this.dataService.getAllPhotos().subscribe((data:any)=>this.getPhoto(data));
    this.dataService.getAvatarActiveUser().subscribe((data:any)=>this.avatarImage=data.avatarUrl);
    
  }

  public getPhoto(data:any){
    this.photos=data.listPhoto;
    this.photosCounter=this.photos.length;
    this.indexImages=new Array();
    var i:number; 
    for(i = 0; i < this.photos.length; i++) {
      this.indexImages.push([i.toString(),this.photos[i]]);
    }
  }

   addPhoto(event) {
    let target = event.target || event.srcElement;
    this.files = target.files;
    console.log(this.files);
    if (this.files) {
      let files :FileList = this.files;
      const formData = new FormData();
      for(let i = 0; i < files.length; i++){
           formData.append('file', files[i]);
      }
      this.dataService.sendPhoto(formData)
      .subscribe(
        p => this.dataService.getAllPhotos()
        .subscribe((data:any)=>this.getPhoto(data))
      );
    }
  }

  openDialog(imageIndex:string,image:string):void {
    const dialogRef = this.dialog.open(DialogDataExampleDialogPhoto, {
      height:"85%",
      maxHeight:"740px",
      minHeight:"740px",
      data: {
        image:image,
        activeUser:this.user,
        avatarImage:this.avatarImage,
        allPhoto:this.indexImages,
        imageIndex:imageIndex,
        imageIndexNumb:parseInt(imageIndex),
        photosCounter:this.photosCounter
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.photosCounter=this.indexImages.length;
      this.dataService.getAllPhotos().subscribe((data:any)=>this.getPhoto(data));
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog-photo',
  templateUrl: 'dialog-data-example-dialog-photo.html',
})
export class DialogDataExampleDialogPhoto {
  constructor(public dialogRef: MatDialogRef<DialogDataExampleDialogPhoto>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private dataService:DataService) {}
  count:number;

  photoRight(){
    var i:number; 
    for(i = 0; i < this.data.allPhoto.length-1; i++) {
      if(this.data.allPhoto[i][0]==this.data.imageIndex){
        if(this.data.imageIndex!=this.data.allPhoto[this.data.allPhoto.length-1][0])
        this.data.image=this.data.allPhoto[i+1][1];
      }
    }
    if(this.data.imageIndex!=this.data.allPhoto[this.data.allPhoto.length-1][0]){
      this.count=parseInt(this.data.imageIndex) + 1;
      this.data.imageIndex=this.count.toString();
      this.data.imageIndexNumb++;
    }
  }

  photoLeft(){
    for( let i = 0; i < this.data.allPhoto.length; i++) {
      if(this.data.allPhoto[i][0]==this.data.imageIndex){
        if(this.data.imageIndex!="0")
        this.data.image=this.data.allPhoto[i-1][1];
      }
    }
    if(this.data.imageIndex!="0"){
      this.count=parseInt(this.data.imageIndex) - 1;
      this.data.imageIndex=this.count.toString();
      this.data.imageIndexNumb--;
    }
  }

  removePhoto(removeIndex:string){
    var i:number; 
    for(i = 0; i < this.data.allPhoto.length; i++) {
      if(this.data.allPhoto[i][0]==removeIndex){
        var f:string=this.data.allPhoto[i][1];
        var d:string = f.substr(22);
        
        if(this.data.imageIndex!="0"){
          this.data.image=this.data.allPhoto[i-1][1];
          this.count=parseInt(this.data.imageIndex) - 1;
          this.data.imageIndex=this.count.toString();
          this.data.imageIndexNumb--;
        }
        else if(this.data.imageIndex!=this.data.allPhoto[this.data.allPhoto.length-1][0]){
          
          this.data.image=this.data.allPhoto[i+1][1];
        }
        this.data.allPhoto.splice([i][0],1);
        this.data.photosCounter=this.data.allPhoto.length;
        
        let indexImages:string[][] = new Array();
        for(let i = 0; i < this.data.allPhoto.length; i++) {
          indexImages.push([i.toString(),this.data.allPhoto[i][1]]);
        }
        this.data.allPhoto=indexImages;
        this.dataService.removePhoto(d).subscribe();
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
