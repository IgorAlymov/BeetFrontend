import { Component, OnInit,Output, EventEmitter } from '@angular/core';
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
  passwortFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  public progressBarOn:boolean=false;
  public errorMessage:boolean=false;
  @Output() public onChanged = new EventEmitter<boolean>();
  @Output() onFullView = new EventEmitter<boolean>();
  typesPassword: string[]=[
    "password",""
  ];
  viewPassword:string="password";

  constructor(private _formBuilder: FormBuilder, private dataService:DataService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      passwortCtrl: this.passwortFormControl,
      emailCtrl: this.emailFormControl
    });
  }

  public startEntry(){
    if(this.firstFormGroup.valid){
      this.progressBarOn=true;
      this.dataService.postEntry(this.entryUser)
    .subscribe( request => this.changeFullView(true),
      error=>this.errorValid(error),
    );
    }
  }

  errorValid(error:any){
    if(error.status==401){
      this.progressBarOn=false;
      this.errorMessage=true;
    }
  }
  
  change(increased:boolean) {
    this.onChanged.emit(increased);
  }
  
  changeFullView(increased:any) {
    this.onFullView.emit(increased);
  }

  showPassword(typesPassword:string){
    if(typesPassword=="password")
    this.viewPassword="";
    else
    this.viewPassword="password";
  }
}
