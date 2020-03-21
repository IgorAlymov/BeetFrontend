import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../data.service';
import { User } from '../models/user';
import { RouterLink, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  entryUser:User=new User();
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
  typesPassword: string[]=[
    "password",""
  ];
  viewPassword:string="password";

  constructor(private _formBuilder: FormBuilder, 
              private dataService:DataService,
              private router:Router,
              private appCom:AppComponent,
              private messageService:MessageService) {
    appCom.fullView=false;
   }

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
    .subscribe(myPage=>this.myPageNavigation(),
      error=>this.errorValid(error)
    );
      this.messageService.connectionHub();
    }
  }

  myPageNavigation(){
    this.router.navigate(['/mypage']);
    this.appCom.fullView=true;
  }

  errorValid(error:any){
    if(error.status==401){
      this.progressBarOn=false;
      this.errorMessage=true;
    }
  }

  showPassword(typesPassword:string){
    if(typesPassword=="password")
    this.viewPassword="";
    else
    this.viewPassword="password";
  }
}
