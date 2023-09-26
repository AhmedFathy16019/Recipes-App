import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import { addIngredient, addIngredients, deleteIngredient, startEditing, stopEditing, updateIngredient } from "./shopping-list.actions";
import { state } from "@angular/animations";

export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export const ShoppingListReducer = createReducer(
    initialState,
    on(addIngredient, (state: State, action) => {
        return {
            ...state,
            ingredients: [ ...state.ingredients, action.ingredient]
        }
    }),
    on(addIngredients, (state:State, action) => {
        return {
            ...state,
            // ingredients: [ ...state.ingredients, action.ingredients]
            ingredients: state.ingredients.concat(action.ingredients)
        }
    }),
    on(updateIngredient, (state, action) => {
        const oldIngredient = { ...state.ingredients[state.editedIngredientIndex] };
        const updatedIngredient = {
            ...oldIngredient,
            ...action.newIngredient
        };
        const updateIngredients = [ ...state.ingredients ];
        updateIngredients[state.editedIngredientIndex] = updatedIngredient;
        return {
            ...state,
            ingredients: updateIngredients,
            editedIngredient: null,
            editedIngredientIndex: -1
        }
    }),
    on(deleteIngredient, (state, action) => {
        return {
            ...state,
            ingredients: state.ingredients.filter((ing, index) => index !== state.editedIngredientIndex),
            editedIngredient: null, 
            editedIngredientIndex: -1
        }
    }),
    on(startEditing, (state, action) => {
        return {
            ...state,
            editedIngredient: { ...state.ingredients[action.index] },
            editedIngredientIndex: action.index
        }
    }),
    on(stopEditing, (state, action) => {
        return {
            ...state,
            editedIngredient: null,
            editedIngredientIndex: -1
        }
    })
);