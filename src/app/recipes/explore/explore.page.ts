import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {


  recipes: Recipe[] | undefined;
  private recipesSub: Subscription | undefined;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesSub = this.recipesService.recipes.subscribe((recipes) => {
      this.recipes = recipes;
    })
  }

  ionViewWillEnter() {
    this.recipesService.getRecipes().subscribe();
  }

  ngOnDestroy() {
    this.recipesSub?.unsubscribe();
  }


}
