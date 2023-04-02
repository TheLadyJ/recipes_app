import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RecipesService } from '../recipes/recipes.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  static editEmail:boolean=false;
  email:string="poslati email";
  private oldEmail:string="";

  constructor(private authService:AuthService, private recipesService: RecipesService) { }

  ngOnInit() {
  }

  onEditEmail(){
    UserDetailsPage.editEmail=true;
    this.oldEmail=this.email;
  }
  
  onSaveEmail(){
    UserDetailsPage.editEmail=false;

    if(this.email=='123'){
      alert('Hii');
    }
    else{
      alert('No');
      //this.email=this.oldEmail;
    }
  }

  onChangePassword(){

  }


  get editEmail(){
    return UserDetailsPage.editEmail;
  }
}
