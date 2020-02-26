import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPageComponent } from './my-page/my-page.component';
import { EntryComponent } from './entry/entry.component';
import { RegistrationComponent } from './registration/registration.component';
import { PhotosComponent } from './photos/photos.component';
import { NewsComponent } from './news/news.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchSubscribersComponent } from './search-subscribers/search-subscribers.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { FriendPageComponent } from './friend-page/friend-page.component';


const routes: Routes = [
   {path:'mypage',component: MyPageComponent},
   {path:'entry',component: EntryComponent},
   {path:'registration',component: RegistrationComponent},
   {path:'photos',component: PhotosComponent},
   {path:'news',component: NewsComponent},
   {path:'settings',component: SettingsComponent},
   {path:'searchSubscribers',component: SearchSubscribersComponent},
   {path:'subscribers',component: SubscribersComponent},
   {path:'friendpage/:id',component: FriendPageComponent},
   {path: '', redirectTo: '/entry', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
