import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {

  savedRecipes: Recipe[] | undefined;
  private savedRecipessSub: Subscription | undefined;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.savedRecipessSub = this.recipesService.savedRecipes.subscribe((savedRecipes) => {
      this.savedRecipes = savedRecipes;
    })
  }

  ionViewWillEnter() {
    this.recipesService.getSavedRecipes().subscribe();
  }

  ngOnDestroy() {
    this.savedRecipessSub?.unsubscribe();
  }

}
