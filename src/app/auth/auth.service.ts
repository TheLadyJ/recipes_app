import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';


interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expresIn: string;
  registered?: boolean;
}

interface UserData {
  name?: string;
  surname?: string;
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  register(user: UserData) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {
        email: user.email,
        password: user.password,
        returnSecureToken: true
      })
      .pipe(
        tap(userData => {
          const expirationTime = new Date(new Date().getTime + userData.expresIn);
          const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
          this._user.next(user);
        })
      );
  }

  login(user: UserData) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      {
        email: user.email,
        password: user.password,
        returnSecureToken: true
      })
      .pipe(
        tap(userData => {
          const expirationTime = new Date(new Date().getTime + userData.expresIn);
          const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
          this._user.next(user);
        })
      );
  }

  logout() {
    this._user.next(null);
    this.router.navigateByUrl('/log-in');
  }

  get isUserAuthenticated() {
    return this._user.asObservable()
      .pipe(
        map((user: User | null) => {
          if (user) {
            return !!user.token;
          }
          else {
            return false;
          }
        })
      );
  }

  get userId() {
    return this._user.asObservable()
      .pipe(
        map((user: User | null) => {
          if (user) {
            return user.id;
          }
          else {
            return null;
          }
        })
      );
  }

  get token() {
    return this._user.asObservable()
      .pipe(
        map((user: User | null) => {
          if (user) {
            return user.token;
          }
          else {
            return null;
          }
        })
      );
  }

}
