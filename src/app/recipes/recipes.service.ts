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
        const myRecipes: Recipe[] = [];
        for (const key in recipesData) {
          if (recipesData.hasOwnProperty(key) && recipesData[key].userId != userId) {
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


  addRecipe(title: string, shortDesc: string, description: string, imageUrl: string) {
    let newRecipe: Recipe = {
      id: null,
      title,
      shortDesc,
      description,
      imageUrl,
      userId: null
    };

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
      }),
      take(1),
      switchMap((resData) => {
        newRecipe.id = resData.name;
        return this.recipes;
      }),
      take(1),
      tap((recipes: any) => {
        this._recipes.next(recipes.concat(newRecipe));
      })
    );
  }
}
