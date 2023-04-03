import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { RecipesService } from '../recipes/recipes.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  static changeEmail: boolean = false;
  static changePassword: boolean = false;
  email: string = "poslati email";
  private oldEmail: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";


  constructor(private authService: AuthService, private recipesService: RecipesService, private alertCtrl: AlertController) { }

  ngOnInit() {
    let myRecipes;
    this.recipesService.getMyRecipes().subscribe(recipes => {
      myRecipes = recipes;
      for (var recipe in myRecipes) {
        console.log(myRecipes[recipe].id)
      }
    })
  }

  onChangeEmail() {
    UserDetailsPage.changeEmail = true;
    this.oldEmail = this.email;
  }


  onSaveEmail() {
    this.authService.changeEmail(this.email).subscribe(resData => {
      this.oldEmail = this.email;

      this.alertCtrl.create({
        header: 'Success!',
        message: 'Email was successfuly changed.',
        buttons: ['OK'],
      }).then(alert => {
        alert.present();
      });
    },
      error => {
        this.email = this.oldEmail;

        let message: string = this.getErrorMessageForEmail(error.error.error.message);
        this.alertCtrl.create({
          header: 'Problem with changing email',
          message,
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      }
    );

    UserDetailsPage.changeEmail = false;
  }

  onChangePassword() {
    this.newPassword = '';
    this.confirmNewPassword = '';
    UserDetailsPage.changePassword = true;
  }

  onSavePassword() {
    if (this.newPassword != this.confirmNewPassword) {
      this.alertCtrl.create({
        header: `Password can't be changed!`,
        message: `Passwords don't match.`,
        buttons: ['OK'],
      }).then(alert => {
        alert.present();
      });
    }

    else {
      this.authService.changePassword(this.newPassword).subscribe(resData => {
        console.log(resData)

        this.alertCtrl.create({
          header: 'Success!',
          message: 'Password was successfuly changed.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.alertCtrl.create({
                  header: `User must sign in again`,
                  message: `The user's credential is no longer valid. The user must sign in again.`,
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.authService.logout()
                      }
                    }
                  ],
                }).then(alert => {
                  alert.present();
                });
              }
            }
          ]
        }).then(alert => {
          alert.present();
        });
      },
        error => {
          this.newPassword = '';
          this.confirmNewPassword = '';

          let message: string = this.getErrorMessageForPassword(error.error.error.message);
          this.alertCtrl.create({
            header: 'Problem with changing password',
            message,
            buttons: ['OK'],
          }).then(alert => {
            alert.present();
          });
        }
      );

      UserDetailsPage.changePassword = false;
    }
  }

  onDeleteAccountAlert() {
    this.alertCtrl.create({
      header: 'Deliting account',
      message: 'Are you sure you want to delete your account? All the recipes you saved will be deleted.',
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            this.alertCtrl.create({
              header: 'Deleting your recipes',
              message: `Do you want to delete all of your recipes? It will be removed from any other user's saved recipes list.`,
              cssClass: 'buttonCss',
              buttons: [
                {
                  text: 'Yes',
                  cssClass: 'delete-button',
                  handler: () => {
                    this.onDeleteMyRecipes();
                    this.DeleteSavedRecipes();
                    this.DeleteAccount();
                  }
                },
                {
                  text: 'No',
                  role: 'cacnel',
                  cssClass: 'cancel-button',
                  handler: () => {
                    this.DeleteSavedRecipes();
                    this.DeleteAccount();
                  }
                }
              ]
            }).then((alert) => alert.present());
          }
        },
        {
          text: 'Cancel',
          role: 'cacnel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Deleting account canceled.');
          }
        }
      ]
    }).then((alert) => alert.present());
  }

  onDeleteMyRecipes() {
    let myRecipes;
    this.recipesService.getMyRecipes().subscribe(recipes => {
      myRecipes = recipes;
      for (var key in myRecipes) {
        this.recipesService.deleteRecipe(myRecipes[key].id).subscribe(resData => {
          console.log(resData)
          console.log('deleted MY recipes')
        },
          () => {
            this.alertCtrl.create({
              header: 'Problem with deleting your recipes.',
              message: 'Something went wrong with deleting all your recipes.',
              buttons: ['OK'],
            }).then(alert => {
              alert.present();
            });
          });
      }
    })
  }

  DeleteSavedRecipes() {
    this.recipesService.deleteAllSavedRecipes().subscribe(resData => {
      console.log(resData)
      console.log('deleted saved recipes')
    },
      () => {
        this.alertCtrl.create({
          header: 'Problem with deleting your saved recipes.',
          message: 'Something went wrong with deleting your saved recipes.',
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      });
  }

  DeleteAccount() {
    this.authService.deleteAccount().subscribe(resData => {
      console.log(resData)
      console.log('deleted account')
    },
      error => {
        let message: string = this.getErrorMessageForDeletingAccount(error.error.error.message);
        this.alertCtrl.create({
          header: 'Problem with deleting your account.',
          message,
          buttons: ['OK'],
        }).then(alert => {
          alert.present();
        });
      }
    );
  }


  get editEmail() {
    return UserDetailsPage.changeEmail;
  }

  get editPassword() {
    return UserDetailsPage.changePassword;
  }

  private getErrorMessageForEmail(message: string) {
    switch (message) {
      case 'EMAIL_EXISTS': return 'The email address is already in use by another account.';
      case 'INVALID_ID_TOKEN': return `The user's credential is no longer valid. The user must sign in again.`;
      case 'INVALID_EMAIL': return 'Invalid email.';
      case 'TOKEN_EXPIRED': return 'Token has expired.';
      default: return 'Something went wrong.'
    }
  }

  private getErrorMessageForPassword(message: string) {
    switch (message) {
      case 'WEAK_PASSWORD : Password should be at least 6 characters': return 'The password must be 6 characters long or more.';
      case 'INVALID_ID_TOKEN': return `The user's credential is no longer valid. The user must sign in again.`;
      case 'TOKEN_EXPIRED': return 'Token has expired.';
      default: return 'Something went wrong.'
    }
  }

  private getErrorMessageForDeletingAccount(message: string) {
    switch (message) {
      case 'USER_NOT_FOUND': return 'There is no user record corresponding to this identifier. The user may have been deleted.';
      case 'INVALID_ID_TOKEN': return `The user's credential is no longer valid. The user must sign in again.`;
      case 'TOKEN_EXPIRED': return 'Token has expired.';
      default: return 'Something went wrong.'
    }
  }


}
