import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditRecipeModalComponent } from '../my-recipes/edit-recipe-modal/edit-recipe-modal.component';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-my-recipes-element',
  templateUrl: './my-recipes-element.component.html',
  styleUrls: ['./my-recipes-element.component.scss'],
})
export class MyRecipesElementComponent  implements OnInit {

  @Input() myRecipe: Recipe = {
    id: 'xxx',
    title: 'XXX',
    shortDesc: 'short desc',
    description: 'Recept x',
    imageUrl: 'https://picsum.photos/200',
    userId: 'xxx'
  };

  constructor(private modalCtrl: ModalController, private recipesService: RecipesService) { }

  ngOnInit() {}

  //openEditModal(title: string | null, shortDesc: string | null, description: string | null, imageUrl: string | null) {
  openEditModal(recipeId: string | null) {
    this.modalCtrl.create({
      component: EditRecipeModalComponent,
      componentProps: {
        recipeId
      }
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if (resultData.role == 'confirm') {
        console.log(resultData);
        let { title, shortDesc, description, imageUrl } = resultData.data.recipeData;
        this.recipesService
          .addRecipe(title, shortDesc, description, imageUrl)
          .subscribe(res => console.log(res));
      }
    })
  }

}
