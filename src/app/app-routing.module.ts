import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyPageComponent } from './my-page/my-page.component';
import { EntryComponent } from './entry/entry.component';
import { RegistrationComponent } from './registration/registration.component';
import { PhotosComponent } from './photos/photos.component';
import { NewsComponent } from './news/news.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
   {path:'mypage',component: MyPageComponent},
   {path:'entry',component: EntryComponent},
   {path:'registration',component: RegistrationComponent},
   {path:'photos',component: PhotosComponent},
   {path:'news',component: NewsComponent},
   {path:'settings',component: SettingsComponent},
   {path: '', redirectTo: '/entry', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
