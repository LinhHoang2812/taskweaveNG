import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = new BehaviorSubject<string>(null);
  constructor(private http: HttpClient, private router: Router) {}

  loginGoogle(payload: {
    email: string;
    provider: string;
    uid: string;
  }): Partial<Observable<{ token: string }>> {
    return this.http.post<{ token: string }>(
      'https://taskweaveapi.onrender.com/api/v1/oauth_signin',
      { user: payload }
    );
  }
  register(payload: {
    email: string;
    password: string;
  }): Partial<Observable<{ token: string }>> {
    return this.http.post<{ token: string }>(
      'https://taskweaveapi.onrender.com/api/v1/registrations',
      { user: payload }
    );
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      'https://taskweaveapi.onrender.com/api/v1/signin',
      payload
    );
  }
  setToken(token: string) {
    this.token.next(token);

    localStorage.setItem('token', token);
  }
  logout() {
    this.token.next(null);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/signin');
  }
}
