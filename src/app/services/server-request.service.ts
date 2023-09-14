import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServerRequestService {
  private apiUrl = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUserDTO[]> {
    return this.http.get<IUserDTO[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        } else {
          errorMessage = `An error occurred: ${error.message}`;
        }
        // You can also re-throw the error to propagate it further up the chain
        return throwError(() => ({
          error,
          errorMessage,
        }));
      })
    );
  }

  getUserById(userId: number): Observable<IUserDTO> {
    return this.http.get<IUserDTO>(this.apiUrl + '/' + userId).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        } else {
          errorMessage = `An error occurred: ${error.message}`;
        }
        // You can also re-throw the error to propagate it further up the chain
        return throwError(() => ({
          error,
          errorMessage,
        }));
      })
    );
  }

  addUser(user: string): Observable<IUserDTO> {
    return this.http.post<IUserDTO>(this.apiUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        } else {
          errorMessage = `An error occurred: ${error.message}`;
        }
        // You can also re-throw the error to propagate it further up the chain
        return throwError(() => ({
          error,
          errorMessage,
        }));
      })
    );
  }

  editUser(user: string, isUserId: number): Observable<IUserDTO> {
    return this.http.put<IUserDTO>(this.apiUrl + '/' + isUserId, user).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        } else {
          errorMessage = `An error occurred: ${error.message}`;
        }
        // You can also re-throw the error to propagate it further up the chain
        return throwError(() => ({
          error,
          errorMessage,
        }));
      })
    );
  }

  deleteUser(userId: number): Observable<IUserDTO> {
    return this.http.delete<IUserDTO>(this.apiUrl + '/' + userId).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        } else {
          errorMessage = `An error occurred: ${error.message}`;
        }
        // You can also re-throw the error to propagate it further up the chain
        return throwError(() => ({
          error,
          errorMessage,
        }));
      })
    );
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
