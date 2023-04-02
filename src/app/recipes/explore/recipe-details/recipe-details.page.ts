import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Recipe } from '../../recipe.model';
import { RecipesService } from '../../recipes.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {


  recipe?: Recipe = {
    id: 'xxx',
    title: 'XXX',
    shortDesc: 'short desc',
    description: `Recept xxx`,
    imageUrl: 'https://picsum.photos/200',
    userId: 'xxx'
  };

  isSaved: boolean = false;

  constructor(private alertCtrl: AlertController, private route: ActivatedRoute, private recipesService: RecipesService) {
  }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.recipesService.getRecipe(paramMap.get('recipeId') as string).subscribe((recipe) => {
        this.recipe = recipe;
      });
    })
    this.recipesService.isSavedValue.subscribe((isSaved) => {
      this.isSaved = isSaved;
    });

  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(paramMap => {
      this.recipesService.isSaved(paramMap.get('recipeId') as string).subscribe();
    })
  }

  openAlertForSave() {
    this.alertCtrl.create({
      header: 'Saving recipe',
      message: 'Are you sure you want to save this recipe?',
      cssClass:'buttonCss',
      buttons: [
        {
          text: 'Save',
          cssClass: 'save-button',
          handler: () => {
            this.recipesService.saveRecipe(this.recipe?.id).subscribe(() => {
              this.recipesService.getSavedRecipes();
              this.route.paramMap.subscribe(paramMap => {
                this.recipesService.isSaved(paramMap.get('recipeId') as string).subscribe();
              })
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cacnel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Saving canceled.');
          }
        }
      ]
    }).then((alert) => alert.present());
  }

  openAlertForRemove() {
    this.alertCtrl.create({
      header: 'Removing recipe',
      message: 'Are you sure you want to remove this recipe from saved recipes?',
      cssClass:'buttonCss',
      buttons: [
        {
          text: 'Remove',
          cssClass: 'remove-button',
          handler: () => {
            this.recipesService.removeFromSaved(this.recipe?.id).subscribe(() => {
              this.recipesService.getSavedRecipes();
              this.route.paramMap.subscribe(paramMap => {
                this.recipesService.isSaved(paramMap.get('recipeId') as string).subscribe();
              })
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cacnel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Removing canceled.');
          }
        }
      ]
    }).then((alert) => alert.present());
  }

}
