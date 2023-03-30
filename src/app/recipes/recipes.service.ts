import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  recipes: Recipe[] = [
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
      imageUrl: 'https://picsum.photos/200',
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


  constructor() { }

  getRecipe(id:string){
    return this.recipes.find(r=>r.id===id)
  }
}
