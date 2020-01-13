import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { UserReg } from '../models/userReg';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  
  entryUser:UserReg=new UserReg();
  firstFormGroup: FormGroup;
  public passwortFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  constructor(private _formBuilder: FormBuilder, private dataService:DataService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      passwortCtrl: this.passwortFormControl,
      emailCtrl: this.emailFormControl
    });
  }

  public progressBarOn:Boolean=false;

  public startEntry(){
    if(this.firstFormGroup.valid){
      this.progressBarOn=true;
      this.dataService.postEntry(this.entryUser)
    .subscribe(
      error=>console.log(error)
    );
    }
  }
}
