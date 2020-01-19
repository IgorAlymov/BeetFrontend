import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserReg } from '../models/userReg';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { MatSnackBar } from '@angular/material';

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
  regUser:UserReg = new UserReg();
  public progressBarOn:Boolean=false;
  public errorMessage:Boolean=false;
  @Output() onFullView = new EventEmitter<boolean>();
  @Output() onChanged = new EventEmitter<boolean>();

  constructor(private _formBuilder: FormBuilder,  private dataService:DataService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: this.nameFormControl,
      lastCtrl: this.lastFormControl,
      passwortCtrl: this.passwortFormControl,
      emailCtrl: this.emailFormControl
    });
  }
  
  public startRegistration(userReg:UserReg) {
    this.progressBarOn=true;
    this.dataService.postRegistration(userReg)
    .subscribe(  fullView => this.changeFullView(true),
      error=>this.errorValid(error)
    );
  }

  errorValid(error:any){
    if(error.status==400){
      this.progressBarOn=false;
      this.errorMessage=true;
    }
  }
  
  changeFullView(increased:any) {
    this.openSnackBar("Регистрация прошла успешно","Ок");
    this.onFullView.emit(increased);
  }

  showEntry(){
    this.onChanged.emit(false);
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
