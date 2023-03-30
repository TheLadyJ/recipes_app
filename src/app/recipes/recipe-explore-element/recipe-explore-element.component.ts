import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-explore-element',
  templateUrl: './recipe-explore-element.component.html',
  styleUrls: ['./recipe-explore-element.component.scss'],
})
export class RecipeExploreElementComponent  implements OnInit {

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
