import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-saved-element',
  templateUrl: './recipe-saved-element.component.html',
  styleUrls: ['./recipe-saved-element.component.scss'],
})
export class RecipeSavedElementComponent  implements OnInit {

  @Input() recipe: Recipe = {
    id: 'xxx',
    title: 'XXX',
    shortDesc: 'short desc',
    description: 'Recept x',
    imageUrl: 'https://picsum.photos/200',
    userId: 'xxx'
  };

  constructor() { }

  ngOnInit() {}

}
