import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { DataService } from './data.service';
import { UserReg } from './models/userReg';

export interface Gender {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //providers:[DataService]
})

export  class AppComponent implements OnInit {
  
  genders: Gender[] = [
    {value: 'Мужской', viewValue: 'Мужской'},
    {value: 'Женский', viewValue: 'Женский'},
    {value: 'Любой', viewValue: 'Любой'}
  ];
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
  secondFormGroup: FormGroup;

  regUser:UserReg = new UserReg();
  constructor(private _formBuilder: FormBuilder, private dataService:DataService) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: this.nameFormControl,
      lastCtrl: this.lastFormControl,
      passwortCtrl: this.passwortFormControl,
      emailCtrl: this.emailFormControl
    });
  }

  public progressBarOn:Boolean=false;
  public startRegistration(userReg:UserReg) {
    this.progressBarOn=true;
    this.dataService.postRegistration(userReg)
    .subscribe(
      error=>console.log(error)
    );
  }
}
