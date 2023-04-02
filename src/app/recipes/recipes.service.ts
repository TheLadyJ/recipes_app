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
  private _savedRecipes = new BehaviorSubject<Recipe[]>([]);
  private _isSaved = new BehaviorSubject<boolean>(false);


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
    let userId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        userId = id;
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
    let userId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        userId = id;
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

  private getSavedRecipesByIds(savedRecipeIds: string[]) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [key: string]: Recipe }>(this.API_link + `/recipes.json?auth=${token}`);
      }),
      map((recipesData: any) => {
        const savedRecipes: Recipe[] = [];
        for (const key in recipesData) {
          if (recipesData.hasOwnProperty(key) && savedRecipeIds.includes(key)) {
            savedRecipes.push(new Recipe(
              key,
              recipesData[key].title,
              recipesData[key].shortDesc,
              recipesData[key].description,
              recipesData[key].imageUrl,
              recipesData[key].userId));
          }
        }
        return savedRecipes;
      }),
      tap(savedRecipes => {
        this._savedRecipes.next(savedRecipes);
      })
    )
  }

  getSavedRecipes() {
    let userId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        userId = id;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http
          .get<string[]>(this.API_link + `/users/${userId}/savedRecipes.json?auth=${token}`);
      }),
      take(1),
      switchMap((savedRecipesIdsJSON) => {
        let savedRecipesIds: string[] = [];
        for (var key in savedRecipesIdsJSON) {
          savedRecipesIds.push(savedRecipesIdsJSON[key]);
        }
        return this.getSavedRecipesByIds(savedRecipesIds);
      })
    )
  }

  get recipes() {
    return this._recipes.asObservable();
  }

  get myRecipes() {
    return this._myRecipes.asObservable();
  }

  get savedRecipes() {
    return this._savedRecipes.asObservable();
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

  editRecipe(recipe: Recipe) {
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

  deleteRecipe(recipeId: string) {
    let userToken: string | null;
    return this.authService.token.pipe(
      take(1),
      switchMap((token, _index) => {
        userToken = token;
        return this.http
          .delete(this.API_link + `/recipes/${recipeId}.json?auth=${userToken}`)
      }),
      take(1),
      switchMap((_deleted, _index) => {
        return this.http
          .get<{ [key: string]: string[] }>(this.API_link + `/users.json?auth=${userToken}`);
      }),
      take(1),
      tap((usersWithSavedRecipesJSON) => {
        for (var userId in usersWithSavedRecipesJSON) {
          for (var recipeKey in usersWithSavedRecipesJSON[userId]) {
            if (usersWithSavedRecipesJSON[userId][recipeKey] == recipeId) {
              let keyRecipeId = usersWithSavedRecipesJSON[userId][recipeKey];
              this.http
                .delete(this.API_link + `/users/${userId}/savedRecipes/${keyRecipeId}.json?auth=${userToken}`);
            }
          }
        }
      })
    )
  }

  saveRecipe(recipeId: string | null | undefined) {
    let userId: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap((id, _index) => {
        userId = id;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        return this.http
          .post<string>(this.API_link + `/users/${userId}/savedRecipes.json?auth=${token}`, JSON.stringify(recipeId));
      })
    );
  }

  isSaved(recipeId: string | null | undefined) {
    let userId: string | null;
    return this.authService.userId.pipe(
      take(1),
      switchMap((id, _index) => {
        userId = id;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        return this.http
          .get<string[]>(this.API_link + `/users/${userId}/savedRecipes.json?auth=${token}`);
      }),
      take(1),
      switchMap((savedRecipesIdsJSON) => {
        for (var key in savedRecipesIdsJSON) {
          if (savedRecipesIdsJSON[key] == recipeId) {
            this._isSaved.next(true);
            return this.isSavedValue;
          }
        }
        this._isSaved.next(false);
        return this.isSavedValue;
      })
    );
  }

  get isSavedValue() {
    return this._isSaved.asObservable();
  }

  removeFromSaved(recipeId: string | null | undefined) {
    let userId: string | null;
    let userToken: string | null;
    let keyRecipeId: string = "";

    return this.authService.userId.pipe(
      take(1),
      switchMap((id, _index) => {
        userId = id;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        userToken = token;
        return this.http
          .get<string[]>(this.API_link + `/users/${userId}/savedRecipes.json?auth=${userToken}`);
      }),
      take(1),
      switchMap((savedRecipesIdsJSON) => {
        for (var key in savedRecipesIdsJSON) {
          if (savedRecipesIdsJSON[key] == recipeId) {
            keyRecipeId = key;
            break;
          }
        }
        return this.http
          .delete(this.API_link + `/users/${userId}/savedRecipes/${keyRecipeId}.json?auth=${userToken}`);
      })
    );
  }

  deleteUserRecipes() {
    let userId: string | null;
    let userToken: string | null;

    return this.authService.userId.pipe(
      take(1),
      switchMap((id, _index) => {
        userId = id;
        return this.authService.token
      }),
      take(1),
      switchMap(token => {
        userToken = token
        return this.http
          .get<{ [key: string]: Recipe }>(this.API_link + `/recipes.json?auth=${userToken}`)
      }),
      map((recipesData: any) => {
        for (const key in recipesData) {
          if (recipesData.hasOwnProperty(key) && recipesData[key].userId == userId) {
            //brise se sa liste svih recepata i kod liste sacuvanih ako postoji negde
            this.deleteRecipe(key)
          }
        }

        //Brisu se svi korisnikovi sacuvani recepti
        this.http
          .delete(this.API_link + `/users/${userId}.json?auth=${userToken}`);
      })
    );
  }

}
