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
import { MessageService } from './message.service';
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
import { FriendPageComponent, FriendAvatarDialog, DialogDataExampleDialogSubscriber } from './friend-page/friend-page.component';
import { MyCommunityComponent } from './my-community/my-community.component';
import { SearchCommunityComponent } from './search-community/search-community.component';
import { MyCommunitiesComponent } from './my-communities/my-communities.component';
import { PageCommunityComponent, DialogDataExampleDialogCom } from './page-community/page-community.component';
import { PageMyCommunityComponent, DialogDataExampleDialogMyCom } from './page-my-community/page-my-community.component';
import { NewsCommunitiesComponent, DialogDataExampleDialogComNews } from './news-communities/news-communities.component';
import { ChatComponent } from './chat/chat.component';
import { ChatsComponent} from './chats/chats.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MyVideoComponent, DialogDataExampleDialogVideo } from './my-video/my-video.component';
import { MyMusicComponent } from './my-music/my-music.component';


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
    FriendAvatarDialog,
    MyCommunityComponent,
    SearchCommunityComponent,
    MyCommunitiesComponent,
    PageCommunityComponent,
    DialogDataExampleDialogCom,
    PageMyCommunityComponent,
    DialogDataExampleDialogMyCom,
    NewsCommunitiesComponent,
    DialogDataExampleDialogComNews,
    ChatComponent,
    ChatsComponent,
    MyVideoComponent,
    DialogDataExampleDialogVideo,
    DialogDataExampleDialogSubscriber,
    MyMusicComponent
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
    MatMenuModule,
    ScrollingModule,
    MatTooltipModule
  ],
  entryComponents:[
    DialogDataExampleDialog,
    DialogDataExampleDialogPhoto,
    DialogDataExampleDialogNews,
    SaveChanges,
    DeletePage,
    FriendAvatarDialog,
    DialogDataExampleDialogCom,
    DialogDataExampleDialogMyCom,
    DialogDataExampleDialogComNews,
    DialogDataExampleDialogVideo,
    DialogDataExampleDialogSubscriber
  ],
  exports: [],
  providers: [
    DataService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
