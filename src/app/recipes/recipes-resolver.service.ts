import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, of, switchMap, take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AppState } from '../store/app.reducer';
import { fetchRecipes, setRecipes } from './store/recipes.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipesService: RecipeService,
    private store: Store<AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes')
      .pipe(
        take(1),
        map(stateData => stateData.recipes),
        switchMap((recipes: Recipe[]) => {
          if (recipes.length === 0) {
            this.store.dispatch(fetchRecipes());
            return this.actions$.pipe(
              ofType(setRecipes),
              take(1),
              map(stateData => stateData.recipes)
            )
          } else {
            return of(recipes);
          }
        })
      )
  }
}
