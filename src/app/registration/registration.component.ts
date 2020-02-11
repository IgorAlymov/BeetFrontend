import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

export interface Gender {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  fullView:boolean=true;
  genders: Gender[] = [
    {value: 'Мужской', viewValue: 'Мужской'},
    {value: 'Женский', viewValue: 'Женский'},
    {value: 'Любой', viewValue: 'Любой'}
  ];
  typesPassword: string[]=[
    "password",""
  ];
  viewPassword:string="password";
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  lastFormControl = new FormControl('', [
    Validators.required
  ]);
  public passwortFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  firstFormGroup: FormGroup;
  regUser:User = new User();
  public progressBarOn:Boolean=false;
  public errorMessage:Boolean=false;

  constructor(private _formBuilder: FormBuilder,  
    private dataService:DataService, 
    private _snackBar: MatSnackBar,
    private router:Router,
    private appCom:AppComponent) {
      appCom.fullView=false;
    }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: this.nameFormControl,
      lastCtrl: this.lastFormControl,
      passwortCtrl: this.passwortFormControl,
      emailCtrl: this.emailFormControl
    });
  }
  
  public startRegistration(userReg:User) {
    this.progressBarOn=true;
    this.dataService.postRegistration(userReg)
    .subscribe( myPage=>this.myPageNavigation(),
      error=>this.errorValid(error)
    );
  }

  myPageNavigation(){
    this.router.navigate(['/mypage']);
    this.appCom.fullView=true;
  }

  errorValid(error:any){
    if(error.status==400){
      this.progressBarOn=false;
      this.errorMessage=true;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  showPassword(typesPassword:string){
    if(typesPassword=="password")
    this.viewPassword="";
    else
    this.viewPassword="password";
  }
}
