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

  constructor(private alertCtrl: AlertController, private route: ActivatedRoute, private recipesService: RecipesService) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.recipesService.getRecipe(paramMap.get('recipeId') as string).subscribe((recipe) => {
        this.recipe = recipe;
      });
    })
  }

  openAlert(event: any) {
    console.log(event);
    event.stopPropagation();
    event.preventDefault();

    this.alertCtrl.create({
      header: 'Saving recipe',
      message: 'Are you sure you want to save this recipe?',
      buttons: [
        {
          text: 'Save',
          handler: () => {
            console.log('save it');
            this.recipesService.saveRecipe(this.recipe?.id).subscribe(()=>{
              this.recipesService.getSavedRecipes();
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cacnel',
          handler: () => {
            console.log('do not save it');
          }
        }
      ]
    }).then((alert) => alert.present());
  }

}
