import { Component, OnInit, Inject } from '@angular/core';
import { Gender } from '../registration/registration.component';
import { User } from '../models/user';
import { DataService } from '../data.service';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../my-page/my-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public fdsfs:string = "fsdf";
  public activeUser:User=new User();
  public change:boolean[]=[false,false,false,false,false,false];
  genders: Gender[] = [
    {value: 'Мужской', viewValue: 'Мужской'},
    {value: 'Женский', viewValue: 'Женский'},
    {value: 'Любой', viewValue: 'Любой'}
  ];

  constructor(private dataService:DataService,public dialog: MatDialog,private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataService.getActiveUser().subscribe((data:User) => this.fillingArray(data));
  }

  fillingArray(user:User){
    Object.keys(user).forEach(function(key){
       if(user[key]==null)
       user[key]="Не указано";
    });
    this.activeUser=user;
  }

  changeName(){
    if(this.change[0]==false)
      this.change[0]=true;
    else
      this.change[0]=false;
  }

  changeLastName(){
    if(this.change[1]==false)
      this.change[1]=true;
    else
      this.change[1]=false;
  }

  changeBirthDay(){
    if(this.change[2]==false)
      this.change[2]=true;
    else
      this.change[2]=false;
  }

  changeCity(){
    if(this.change[3]==false)
      this.change[3]=true;
    else
      this.change[3]=false;
  }

  changePhone(){
    if(this.change[4]==false)
      this.change[4]=true;
    else
      this.change[4]=false;
  }

  changeGender(){
    if(this.change[5]==false)
      this.change[5]=true;
    else
      this.change[5]=false;
  }

  changeSave(user:User){
    if(this.change[2]==true)
    user.birthday.setDate(user.birthday.getDate() + 1);
    Object.keys(user).forEach(function(key){
      if(user[key]=="Не указано" || user[key]=="")
      user[key]=null;
   });
   for(let i = 0; i < this.change.length; i++) {
      this.change[i]=false;
   }
  this.dataService.changeSave(user).subscribe(
      p=> this.dataService.getActiveUser().subscribe((data:User) => this.fillingArray(data))
      
    );
    this.openSnackBar();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SaveChanges, {
      duration: 5000
    });
  }

  deletePage(): void {
    const dialogRef = this.dialog.open(DeletePage, {
      width: '350px'
    });
  }
}

@Component({
  selector: 'save-changes',
  templateUrl: 'save-changes.html'
})
export class SaveChanges {

}

@Component({
  selector: 'delete-page',
  templateUrl: 'delete-page.html',
})
export class DeletePage {
  private router:Router;

  constructor(private dataService:DataService,
    public dialogRef: MatDialogRef<DeletePage>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletePage(){
    this.dataService.deletePage().subscribe(
    );
    this.dialogRef.close();
  }
}