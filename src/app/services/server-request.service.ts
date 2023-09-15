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

  _handleHttpErrorResponse(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error';
    } else {
      errorMessage = `An error occurred: ${error.message}`;
    }

    return throwError(
      () =>
        ({
          error,
          errorMessage,
        } as ICustomError)
    );
  }

  getUsers(): Observable<IUserDTO[]> {
    return this.http
      .get<IUserDTO[]>(this.apiUrl)
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  getUserById(userId: number): Observable<IUserDTO> {
    return this.http
      .get<IUserDTO>(this.apiUrl + '/' + userId)
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  addUser(user: ISaveUserDTO): Observable<IUserDTO> {
    return this.http
      .post<IUserDTO>(this.apiUrl, JSON.stringify(user))
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  editUser(id: number, user: ISaveUserDTO): Observable<IUserDTO> {
    return this.http
      .put<IUserDTO>(this.apiUrl + '/' + id, JSON.stringify(user))
      .pipe(catchError(this._handleHttpErrorResponse));
  }

  deleteUser(userId: number): Observable<IUserDTO> {
    return this.http
      .delete<IUserDTO>(this.apiUrl + '/' + userId)
      .pipe(catchError(this._handleHttpErrorResponse));
  }
}

export interface IUserNameDTO {
  firstname: string;
  lastname: string;
}

export interface IUserAddressDTO {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation: IUserGeolocationDTO;
}

export interface IUserGeolocationDTO {
  lat: string;
  long: string;
}

export interface IUserDTO {
  id: number;
  email: string;
  username: string;
  password: string;
  name: IUserNameDTO;
  address: IUserAddressDTO;
  phone: string;
}

export interface ISaveUserDTO extends Omit<IUserDTO, 'id'> {}

export interface ICustomError {
  error: HttpErrorResponse;
  errorMessage: string;
}
