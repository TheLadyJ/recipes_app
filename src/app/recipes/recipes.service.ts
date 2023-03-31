import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from './recipe.model';

interface RecipeData {
  title:string;
  shortDesc: string;
  description: string;
  imageUrl: string;
}



@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  oldRecipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Torta',
      shortDesc: 'short desc 1',
      description: `Sastojci
      ZA DEKORATIVNU PASTU:
      1 bjelanjak
      30 g mekanog maslaca
      30 g šećera
      40 g Podravka Glatkog brašna
      prstohvat soli
      prehrambena boja – narančasta i zelena

      ZA BISKVIT:
      4 žumanjka
      3 bjelanjka
      75 g šećera
      1 žlica ulja
      25 ml mlijeka
      25 g kakaa
      35 g Podravka Glatkog brašna
      10 g Dolcela Gussnela

      ZA KREMU:
      1 Dolcela Puding vanilija
      350 ml mlijeka
      30 g šećera
      200 ml Dolcela Šlaga 5+`,
      imageUrl: 'https://www.oetker.rs/Recipe/Recipes/oetker.rs/rs-sr/cakes/image-thumb__158620__RecipeDetail/baron-torta.webp',
      userId: 'u1'
    },
    {
      id: 'r2',
      title: 'Spanac',
      shortDesc: 'short desc 2',
      description: 'Recept 2',
      imageUrl: 'https://picsum.photos/200',
      userId: 'u1'
    },
    {
      id: 'r3',
      title: 'Pasulj',
      shortDesc: 'short desc 3',
      description: 'Recept 3',
      imageUrl: 'https://picsum.photos/200',
      userId: 'u1'
    },
    {
      id: 'r4',
      title: 'Supa',
      shortDesc: 'short desc 4',
      description: 'Recept 4',
      imageUrl: 'https://picsum.photos/200',
      userId: 'u1'
    },
  ]

  private _recipes = new BehaviorSubject<Recipe[]>([]);


  constructor(private http: HttpClient, private authService: AuthService) { }

  getRecipe(id:string){
    return this.oldRecipes.find(r=>r.id===id)
  }


  private API_link: string = 'https://mr-recipes-app-default-rtdb.europe-west1.firebasedatabase.app';

  getRecipes(){
    return this.http
    .get<{ [key: string]: RecipeData }>(this.API_link+`/recipes.json`)
    .pipe(
      map((recipesData:any)=>{
      const recipes: Recipe[] = [];
      for(const key in recipesData){
        if(recipesData.hasOwnProperty(key)){
          recipes.push({
            id:key,
            title: recipesData[key].title,
            shortDesc: recipesData[key].shortDesc,
            description: recipesData[key].description,
            imageUrl: recipesData[key].imageUrl,
            userId: null,
          })
        }
      }
      return recipes;
    }),
    tap(recipes=>{
      this._recipes.next(recipes);
    }))
  }

  get recipes() {
    return this._recipes.asObservable();
  }


  // getQuotes() {
  //   return this.authService.token.pipe(
  //     take(1),
  //     switchMap(token => {
  //       return this.http
  //         .get<{ [key: string]: QuoteData }>(this.API_link + `/quotes.json?auth=${token}`);
  //     }),
  //     map((quotesData) => {
  //       const quotes: Quote[] = [];
  //       for (const key in quotesData) {
  //         if (quotesData.hasOwnProperty(key)) {
  //           quotes.push(new Quote(key, quotesData[key].author, quotesData[key].text, 'https://picsum.photos/200', quotesData[key].userId))
  //         }
  //       }
  //       return quotes;
  //     }),
  //     tap(quotes => {
  //       this._quotes.next(quotes);
  //     })
  //   );
  // }


  addRecipe(title: string, shortDesc: string, description:string, imageUrl: string) {
    let newRecipe: Recipe={
      id:null,
      title,
      shortDesc,
      description,
      imageUrl,
      userId:null
    };

    return this.http.post<{name: string}>(this.API_link+`/recipes.json`, newRecipe)
    .pipe(
      switchMap(resData=>{
        newRecipe.id=resData.name;
        return this.recipes;
      }),
      take(1),
      tap((recipes)=>{
        this._recipes.next(recipes.concat(newRecipe));
      }));

    // return this.authService.userId.pipe(
    //   take(1),
    //   switchMap((userId, _index) => {
    //     newQuote = new Quote(
    //       null,
    //       author,
    //       text,
    //       'https://picsum.photos/200',
    //       userId
    //     );
    //     return this.authService.token.pipe(
    //       take(1),
    //       switchMap(token => {
    //         return this.http
    //           .post<{ name: string }>(this.API_link + `/quotes.json?auth=${token}`, newQuote);
    //       }),
    //     );
    //   }),
    //   take(1),
    //   switchMap((resData) => {
    //     generatedId = resData.name;
    //     return this.quotes;
    //   }),
    //   take(1),
    //   tap((quotes: any) => {
    //     newQuote.id = generatedId;
    //     this._quotes.next(quotes.concat(newQuote));
    //   })
    // );
  }
}
