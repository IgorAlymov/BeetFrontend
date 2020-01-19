import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule} from '@angular/material/slider'
import { MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatButtonModule} from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule} from '@angular/material/card';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material';
import { MatSelectModule} from '@angular/material/select';
import { MatIconModule} from '@angular/material/icon';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { DataService } from './data.service';
import { RegistrationComponent } from './registration/registration.component';
import { EntryComponent } from './entry/entry.component';
import {MatBadgeModule} from '@angular/material/badge';
import { MyPageComponent } from './my-page/my-page.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EntryComponent,
    MyPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  exports: [],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
