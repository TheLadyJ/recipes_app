import { Recipe } from './recipe.model';

describe('Recipe', () => {
  it('should create an instance', () => {
    expect(new Recipe(null,null,null,null,null,null)).toBeTruthy();
  });
});
