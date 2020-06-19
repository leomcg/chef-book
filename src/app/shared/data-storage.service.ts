import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingredient.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private slService: ShoppingListService,
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://chef-book-9904d.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://chef-book-9904d.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  storeIngredients() {
    const ingredients = this.slService.getIngredients();
    // const ingredients = [
    //   new Ingredient('tomatoes', '10'),
    //   new Ingredient('onions', '2')
    // ]
    this.http.put('https://chef-book-9904d.firebaseio.com/ingredients.json', ingredients)
    .subscribe(response => {
      console.log(response);
    });
  }

  fetchIngredients() {
    this.http.get<Ingredient []>('https://chef-book-9904d.firebaseio.com/ingredients.json')
    .pipe(tap(ingredients => {
      this.slService.setIngredients(ingredients);
    }))
    .subscribe();
  }
}
