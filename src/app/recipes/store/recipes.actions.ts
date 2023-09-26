import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const fetchRecipes = createAction(
    '[Recipes] FETCH_RECIPES'
)

export const storeRecipes = createAction(
    '[Recipes] STORE_RECIPES'
)

export const setRecipes = createAction(
    '[Recipes] SET_RECIPES',
    props<{ recipes: Recipe[] }>()
)

export const addRecipe = createAction(
    '[Recipes] ADD_RECIPES',
    props<{ recipe: Recipe }>()
)

export const updateRecipe = createAction(
    '[Recipes] UPDATE_RECIPES',
    props<{ index: number, recipe: Recipe }>()
)

export const deleteRecipe = createAction(
    '[Recipes] DELETE_RECIPES',
    props<{ index: number }>()
)