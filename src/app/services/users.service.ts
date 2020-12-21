import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  //Instead of subscribing it,we can use then() method
  // async getAllUsers(){
  //   return await this.http.get(`${BASEURL}/users`);
  // }

  getAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  getUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/users/${id}`);
  }

  getUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  followUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  unFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  //'Optional Parameter' means either we can pass the value to it or not...
  //deleteVal? is the optional parameter...To mention this as optional parameter,we are using ?
  //optional parameter must be declared after required parameter
  markNotification(id, deleteVal?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteVal
    });
  }

  markAllRead() {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  addImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }
}
