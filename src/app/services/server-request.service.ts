import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerRequestService {
  private apiUrl = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUserDTO[]> {
    return this.http.get<IUserDTO[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<IUserDTO> {
    return this.http.get<IUserDTO>(this.apiUrl + '/' + userId);
  }

  addUser(user: string): Observable<IUserDTO> {
    return this.http.post<IUserDTO>(this.apiUrl, user);
  }

  editUser(user: string, isUserId: number): Observable<IUserDTO> {
    return this.http.put<IUserDTO>(this.apiUrl + '/' + isUserId, user);
  }

  deleteUser(userId: number): Observable<IUserDTO> {
    return this.http.delete<IUserDTO>(this.apiUrl + '/' + userId);
  }
}

export interface IUserDTO {
  id: number;
  email: string;
  username: string;
  password: string;
  name: Name;
  address: Address;
  phone: string;
}

export interface Name {
  firstname: string;
  lastname: string;
}

export interface Address {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation: Geolocation;
}

export interface Geolocation {
  lat: string;
  long: string;
}
