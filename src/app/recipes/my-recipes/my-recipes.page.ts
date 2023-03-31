import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RecipesService } from '../recipes.service';
import { AddRecipeModalComponent } from './add-recipe-modal/add-recipe-modal.component';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
})
export class MyRecipesPage implements OnInit {

  constructor(private recipesService:RecipesService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  openAddModal(){
    this.modalCtrl.create({
      component: AddRecipeModalComponent
    }).then((modal)=>{
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData)=>{
      if(resultData.role=='confirm'){
        console.log(resultData);
        let {title, shortDesc, description, imageUrl} = resultData.data.recipeData;
        this.recipesService
        .addRecipe(title, shortDesc, description, imageUrl)
        .subscribe(res=>console.log(res));
      }
    })
  }

}
