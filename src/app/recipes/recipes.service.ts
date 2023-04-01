import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from './recipe.model';


@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private _recipes = new BehaviorSubject<Recipe[]>([]);
  private _myRecipes = new BehaviorSubject<Recipe[]>([]);


  private API_link: string = 'https://mr-recipes-app-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRecipe(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [attribute: string]: string }>(this.API_link + '/recipes/' + id + '.json' + '?auth=' + token);
      }),
      map((recipeData) => ({
        id,
        title: recipeData['title'],
        shortDesc: recipeData['shortDesc'],
        description: recipeData['description'],
        imageUrl: recipeData['imageUrl'],
        userId: recipeData['userId']
      }
      ) as Recipe)
    );
  }

  getRecipes() {
    let userId:string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(id=>{
        userId=id;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [key: string]: Recipe }>(this.API_link + `/recipes.json?auth=${token}`);
      }),
      map((recipesData: any) => {
        const recipes: Recipe[] = [];
        for (const key in recipesData) {
          if (recipesData.hasOwnProperty(key) && recipesData[key].userId != userId) {
            recipes.push(new Recipe(
              key,
              recipesData[key].title,
              recipesData[key].shortDesc,
              recipesData[key].description,
              recipesData[key].imageUrl,
              recipesData[key].userId));
          }
        }
        return recipes;
      }),
      tap(recipes => {
        this._recipes.next(recipes);
      })
    )
  }

  getMyRecipes() {
    let userId:string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(id=>{
        userId=id;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [key: string]: Recipe }>(this.API_link + `/recipes.json?auth=${token}`);
      }),
      map((recipesData: any) => {
        const myRecipes: Recipe[] = [];
        for (const key in recipesData) {
          if (recipesData.hasOwnProperty(key) && recipesData[key].userId == userId) {
            myRecipes.push(new Recipe(
              key,
              recipesData[key].title,
              recipesData[key].shortDesc,
              recipesData[key].description,
              recipesData[key].imageUrl,
              recipesData[key].userId));
          }
        }
        return myRecipes;
      }),
      tap(myRecipes => {
        this._myRecipes.next(myRecipes);
      })
    )
  }

  get recipes() {
    return this._recipes.asObservable();
  }

  get myRecipes() {
    return this._myRecipes.asObservable();
  }

  addRecipe(newRecipe: Recipe) {
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId, _index) => {
        newRecipe.userId = userId;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        return this.http
          .post<{ name: string }>(this.API_link + `/recipes.json?auth=${token}`, newRecipe)
      })
    );
  }

  editRecipe(recipe:Recipe){
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId, _index) => {
        recipe.userId = userId;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        return this.http
          .put<{ name: string }>(this.API_link + `/recipes/${recipe.id}.json?auth=${token}`, recipe)
      })
    );
  }

  deleteRecipe(recipeId:string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token, _index)=>{
        return this.http
          .delete(this.API_link + `/recipes/${recipeId}.json?auth=${token}`)
      })
    )
  }

}
