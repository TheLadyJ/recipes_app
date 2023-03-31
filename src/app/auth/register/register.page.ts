import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  private checkPasswords(firstPassword: string, secondPassword: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(firstPassword);
      const matchControl = controls.get(secondPassword);

      if (!matchControl?.errors && control?.value !== matchControl?.value) {
        matchControl?.setErrors({
          matchingPasswords: {
            actualValue: matchControl?.value,
            requiredValue: control?.value
          }
        });
        return { matchingPasswords: true };
      }
      return null;
    };
  }

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router, private alertCtrl: AlertController) {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, { validators: [this.checkPasswords('password', 'confirmPassword')] });
  }

  ngOnInit() {
  }

  private getErrorMessage(message: string){
    switch (message) {
      case 'EMAIL_EXISTS': return 'The email address is already in use by another account.';
      case 'OPERATION_NOT_ALLOWED': return 'Password sign-in is disabled for this project';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': return 'We have blocked all requests from this device due to unusual activity. Try again later.';
      case 'INVALID_EMAIL': return 'Invalid email';
      default: return 'Registration not possible'
    }
  }


  onRegister() {
    this.loadingCtrl
      .create({ message: "Registering..." })
      .then((loadingEl) => {
        loadingEl.present();
        
        this.authService.register(this.registerForm.value).subscribe(resData => {
          console.log('Successful registration');
          console.log(resData);
          this.router.navigateByUrl('/recipes');
          loadingEl.dismiss();
        },
          async error => {         
            let message: string = this.getErrorMessage(error.error.error.message);
            console.log("Error cought:");
            console.log(error);

            loadingEl.dismiss();
            this.alertCtrl.create({
              header: 'Problem with registration',
              message,
              buttons: ['OK'],
            }).then(alert => {
              alert.present();
            });
          });
      });
  }
}
