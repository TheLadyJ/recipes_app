import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRecipesPageRoutingModule } from './my-recipes-routing.module';

import { MyRecipesPage } from './my-recipes.page';
import { AddRecipeModalComponent } from './add-recipe-modal/add-recipe-modal.component';
import { MyRecipesElementComponent } from '../my-recipes-element/my-recipes-element.component';
import { EditRecipeModalComponent } from './edit-recipe-modal/edit-recipe-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRecipesPageRoutingModule
  ],
  declarations: [MyRecipesPage, AddRecipeModalComponent,MyRecipesElementComponent, EditRecipeModalComponent],
  entryComponents:[AddRecipeModalComponent]
})
export class MyRecipesPageModule {}
