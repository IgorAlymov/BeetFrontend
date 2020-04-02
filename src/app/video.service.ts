import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  
  private userUrl="http://localhost:5001/api/";
  headers:any={ headers: new HttpHeaders(), withCredentials: true };

  constructor(private http:HttpClient) { }

  public addVideo(formData:FormData){
    //return this.http.post(this.userUrl + "AddVideo",formData,this.headers);

    return this.http.post<any>(this.userUrl + "AddVideo", formData, {
      reportProgress: true,
      headers: new HttpHeaders(), 
      withCredentials: true,
      observe: 'events'
    });
  }

  public getAllVideo(id:number){
    return this.http.get(this.userUrl + "GetAllVideo/" + id,this.headers);
  }

  public addViewVideo(idVideo:number){
    return this.http.put(this.userUrl + "AddViewVideo/" + idVideo,this.headers);
  }

  public deleteVideo(videoId: number) {
    return this.http.delete(this.userUrl+"DeleteVideo/"+videoId,this.headers);
  }
}
