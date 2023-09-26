import * as fromSLReducer from '../shopping-list/store/shopping-list.reducer'
import * as fromAuthReducer from '../auth/store/auth.reducer'
import * as fromRecipesReducer from '../recipes/store/recipes.reducer'
import { ActionReducerMap } from '@ngrx/store'

export interface AppState {
    shoppingList: fromSLReducer.State,
    auth: fromAuthReducer.State,
    recipes: fromRecipesReducer.State
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromSLReducer.ShoppingListReducer,
    auth: fromAuthReducer.authReducer,
    recipes: fromRecipesReducer.recipesReducer
}