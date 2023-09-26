import { createAction, props } from '@ngrx/store'
import { Ingredient } from '../../shared/ingredient.model'

export const addIngredient = createAction(
    '[Shopping-List] ADD_INGREDIENT',
    props<{ ingredient: Ingredient }>()
)

export const addIngredients = createAction(
    '[Shopping-List] ADD_INGREDIENTS',
    props<{ ingredients: Ingredient[] }>()
)

export const updateIngredient = createAction(
    '[Shopping-List] UPDATE_INGREDIENT',
    props<{ newIngredient: Ingredient }>()
)

export const deleteIngredient = createAction(
    '[Shopping-List] DELETE_INGREDIENT'
)

export const startEditing = createAction(
    '[Shopping-List] START_EDITING',
    props<{ index: number }>()
)

export const stopEditing = createAction(
    '[Shopping-List] STOP_EDITING'
)