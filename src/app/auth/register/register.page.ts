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

  onRegister() {

  }

}
