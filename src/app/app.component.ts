import { Component, OnInit, Output} from '@angular/core';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export  class AppComponent{
  public viewReg:boolean=false;
  public fullView:boolean;

  constructor(private dataService:DataService) {
    this.fullView=true;
  }

  output(){
    this.dataService.signOut()
    .subscribe(  
      error=>console.log(error)
    );
    this.viewReg=false;
    this.fullView=false;
  }
}
