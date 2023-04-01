import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { AddRecipeModalComponent } from './add-recipe-modal/add-recipe-modal.component';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.page.html',
  styleUrls: ['./my-recipes.page.scss'],
})
export class MyRecipesPage implements OnInit {
  
  myRecipes: Recipe[] | undefined;
  private myRecipesSub: Subscription | undefined;

  constructor(private recipesService: RecipesService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myRecipesSub = this.recipesService.myRecipes.subscribe((myRecipes) => {
      this.myRecipes = myRecipes;
    })
  }

  ionViewWillEnter() {
    this.recipesService.getMyRecipes().subscribe();
  }

  ngOnDestroy() {
    this.myRecipesSub?.unsubscribe();
  }

  openAddModal() {
    this.modalCtrl.create({
      component: AddRecipeModalComponent
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role == 'confirm') {
        let { title, shortDesc, description, imageUrl } = resultData.data.recipeData;
        let newRecipe:Recipe={
          id: null,
          title,
          shortDesc,
          description,
          imageUrl,
          userId: null
        }
        this.recipesService
          .addRecipe(newRecipe)
          .subscribe(() => {
            this.recipesService.getMyRecipes().subscribe();
          });
      }
    })
  }

}
