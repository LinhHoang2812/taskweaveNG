import { Component, NgZone } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment as env } from 'src/environments/environment';

declare const google: any;
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    // (globalThis as any).handleLoginGoogle = (response: any) => {
    //   const cred = <any>jwtDecode(response.credential);
    //   const email = cred.email;
    //   const uid = cred.sub;
    //   this.authService
    //     .loginGoogle({ email, provider: 'google', uid })
    //     .subscribe((res: { token: string }) => {
    //       this.authService.setToken(res.token);
    //       this.router.navigate(['/']);
    //     });
    // };

    const button = document.getElementById('g_id_signin');

    google.accounts.id.initialize({
      client_id:
        '308141161119-hajvkd32v2rvesqj07uplofu5ntlbq36.apps.googleusercontent.com',

      callback: (res: any, error: any) => {
        const cred = <any>jwtDecode(res.credential);
        const email = cred.email;
        const uid = cred.sub;
        this.authService
          .loginGoogle({ email, provider: 'google', uid })
          .subscribe((res: { token: string }) => {
            this.authService.setToken(res.token);
            this.zone.run(() => this.router.navigate(['/']));
          });
      },
    });
    google.accounts.id.renderButton(button, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: '400',
    });
  }
}
