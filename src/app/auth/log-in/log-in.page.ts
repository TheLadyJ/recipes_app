import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  logInForm: FormGroup;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) {
    this.logInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
  }

  private getErrorMessage(message: string) {
    switch (message) {
      case 'EMAIL_NOT_FOUND': return 'There is no user record corresponding to this identifier. The user may have been deleted.';
      case 'INVALID_PASSWORD': return 'The password is invalid.';
      case 'USER_DISABLED': return 'The user account has been disabled by an administrator.';
      case 'INVALID_EMAIL': return 'Invalid email';
      default: return 'Logging in not possible'
    }
  }

  onLogIn() {
    this.isLoading = true;
    
    this.authService.login(this.logInForm.value).subscribe(resData => {
      this.isLoading = false;
      this.router.navigateByUrl('/recipes');
      this.logInForm.reset();
    },
      async error => {
        console.log(error);
        let message: string = this.getErrorMessage(error.error.error.message);

        this.isLoading = false;
        this.alertCtrl.create({
          header: 'Problem with logging in',
          message,
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });

        this.logInForm.reset();
      }
    );
  }

}
