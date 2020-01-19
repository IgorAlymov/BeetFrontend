import { Component} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DataService } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export  class AppComponent {
  public viewReg:boolean=false;
  public fullView:boolean=false;

  constructor(private dataService:DataService) {}
  
  onChanged(increased:boolean){
        this.viewReg=increased;
        console.log(1);
  }

  onFullView(increased:boolean){
      this.fullView=increased;
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
