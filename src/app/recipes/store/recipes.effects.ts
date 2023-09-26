import { Actions, createEffect, ofType } from "@ngrx/effects";
import { fetchRecipes, setRecipes, storeRecipes } from "./recipes.actions";
import { map, switchMap, take, tap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { AppState } from "src/app/store/app.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<AppState>
    ) {}

    fetchRecipes = createEffect(() => {
        return this.actions$.pipe(
            ofType(fetchRecipes),
            switchMap(() => {
                return this.http
                    .get(
                        'https://recipes-app-angular-2ee0d-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
                    )
            }),
            map((recipes: Recipe[]) => {
                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            map(recipes => {
                return setRecipes({ recipes });
            })
        )
    })

    storeRecipes = createEffect(() => {
        return this.actions$.pipe(
            ofType(storeRecipes),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, stateData]) => {
                return this.http
                    .put(
                        'https://recipes-app-angular-2ee0d-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
                        stateData.recipes
                    )
            }),
        )
    }, {
        dispatch: false
    })
}