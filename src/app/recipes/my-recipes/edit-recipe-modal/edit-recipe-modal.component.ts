import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { RecipesService } from '../../recipes.service';

@Component({
  selector: 'app-edit-recipe-modal',
  templateUrl: './edit-recipe-modal.component.html',
  styleUrls: ['./edit-recipe-modal.component.scss'],
})
export class EditRecipeModalComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm | undefined;
  @Input() recipeId: string = "";

  constructor(private modalCtrl: ModalController, private recipesService: RecipesService, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.recipesService.getRecipe(this.recipeId).subscribe((recipe) => {
      this.form?.controls['title'].setValue(recipe.title);
      this.form?.controls['shortDesc'].setValue(recipe.shortDesc);
      this.form?.controls['description'].setValue(recipe.description);
      this.form?.controls['imageUrl'].setValue(recipe.imageUrl);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onEditRecipe() {
    this.modalCtrl.dismiss({
      recipeData: {
        title: this.form?.value['title'],
        shortDesc: this.form?.value['shortDesc'],
        description: this.form?.value['description'],
        imageUrl: this.form?.value['imageUrl']
      }
    }, 'confirm');

  }

  openAlert() {
    this.alertCtrl.create({
      header: 'Deliting recipe',
      message: 'Are you sure you want to delete this recipe?',
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            this.onDeleteRecipe();
            this.modalCtrl.dismiss();
          }
        },
        {
          text: 'Cancel',
          role: 'cacnel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Deleting canceled.');
          }
        }
      ]
    }).then((alert) => alert.present());
  }


  private onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.recipeId).subscribe(() => {
      this.recipesService.getMyRecipes().subscribe();
    });
  }

}
