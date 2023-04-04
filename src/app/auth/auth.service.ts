import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';


interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface ChangeDetailsResponseData {
  localId: string,
  email: string,
  passwordHash: string,
  providerUserInfo: Object[],
  idToken: string,
  refreshToken: string,
  expiresIn: string
}

interface GetUserResponseData {
  localId: string,
  email: string,
  emailVerified: boolean,
  displayName: string,
  providerUserInfo: Object[],
  photoUrl: string,
  passwordHash: string,
  passwordUpdatedAt: number,
  validSince: string,
  disabled: boolean,
  lastLoginAt: string,
  createdAt: string,
  customAuth: boolean
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
          const expirationTime = new Date(new Date().getTime + userData.expiresIn);
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
          const expirationTime = new Date(new Date().getTime + userData.expiresIn);
          const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
          this._user.next(user);
        })
      );
  }

  getUser() {
    return this.token.pipe(
      switchMap(token=>{
        return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${environment.firebaseAPIKey}`,
        {
          idToken: token
        })
      })
    )
    
  }

  changeEmail(newEmail: string) {
    return this.token.pipe(
      switchMap(token => {
        return this.http.post<ChangeDetailsResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseAPIKey}`,
          {
            idToken: token,
            email: newEmail,
            returnSecureToken: true
          })
      }),
      take(1),
      tap(userData => {
        const expirationTime = new Date(new Date().getTime + userData.expiresIn);
        const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        this._user.next(user);
      })
    )
  }

  changePassword(newPassword: string) {
    return this.token.pipe(
      switchMap(token => {
        return this.http.post<ChangeDetailsResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseAPIKey}`,
          {
            idToken: token,
            password: newPassword,
            returnSecureToken: true
          })
      }),
      take(1),
      tap(userData => {
        const expirationTime = new Date(new Date().getTime + userData.expiresIn);
        const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
        this._user.next(user);
      })
    )
  }

  deleteAccount() {
    return this.token.pipe(
      switchMap(token => {
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${environment.firebaseAPIKey}`,
          {
            idToken: token
          })
      }),
      take(1),
      tap(() => {
        this.logout()
      })
    )
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
