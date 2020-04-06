import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private userUrl="http://localhost:5001/api/";
  headers:any={ headers: new HttpHeaders(), withCredentials: true };

  constructor(private http:HttpClient) { }

  public addMusic(formData:FormData){
      return this.http.post<any>(this.userUrl+"AddMusic",formData, {
        reportProgress: true,
        headers: new HttpHeaders(), 
        withCredentials: true,
        observe: 'events'
    });
  }

  public getAllMusic(id:number){
    return this.http.get(this.userUrl + "GetAllMusic/" + id, this.headers);
  }

  public deleteMusic(musicId:number){
    return this.http.delete(this.userUrl + "DeleteMusic/" + musicId, this.headers);
  }
}
