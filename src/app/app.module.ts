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
import { MyPageComponent, DialogDataExampleDialog } from './my-page/my-page.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { PhotosComponent, DialogDataExampleDialogPhoto } from './photos/photos.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { NewsComponent, DialogDataExampleDialogNews } from './news/news.component';
import { SettingsComponent, SaveChanges, DeletePage } from './settings/settings.component';
import { SearchSubscribersComponent } from './search-subscribers/search-subscribers.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { FriendPageComponent, FriendAvatarDialog } from './friend-page/friend-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EntryComponent,
    MyPageComponent,
    DialogDataExampleDialog,
    PhotosComponent,
    DialogDataExampleDialogPhoto,
    NewsComponent,
    DialogDataExampleDialogNews,
    SettingsComponent,
    SaveChanges,
    DeletePage,
    SearchSubscribersComponent,
    SubscribersComponent,
    FriendPageComponent,
    FriendAvatarDialog
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
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatGridListModule,
    MatTabsModule,
    MatMenuModule
  ],
  entryComponents:[
    DialogDataExampleDialog,
    DialogDataExampleDialogPhoto,
    DialogDataExampleDialogNews,
    SaveChanges,
    DeletePage,
    FriendAvatarDialog
  ],
  exports: [],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
