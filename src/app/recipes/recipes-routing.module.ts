import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesPage } from './recipes.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: RecipesPage,
    children:[
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)
      },
      {
        path: 'saved',
        loadChildren: () => import('./saved/saved.module').then( m => m.SavedPageModule)
      },
      {
        path: 'my-recipes',
        loadChildren: () => import('./my-recipes/my-recipes.module').then( m => m.MyRecipesPageModule)
      },
      {
        path: '',
        redirectTo: '/recipes/tabs/explore',
        pathMatch: 'full'
      },
    ],
    
  },
  {
    path: '',
    redirectTo: '/recipes/tabs/explore',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesPageRoutingModule {}
