import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-recipe-modal',
  templateUrl: './add-recipe-modal.component.html',
  styleUrls: ['./add-recipe-modal.component.scss'],
})
export class AddRecipeModalComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm | undefined;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onAddRecipe() {
    this.modalCtrl.dismiss({
      recipeData: {
        title: this.form?.value['title'],
        shortDesc: this.form?.value['shortDesc'],
        description: this.form?.value['description'],
        imageUrl: this.form?.value['imageUrl']
      }
    }, 'confirm');

  }

}
