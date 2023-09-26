import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import { authenticateSuccess, authenticateFail, logout, startLogin, startSignup, clearError } from "./auth.actions";

export interface State {
    user: User;
    authError: string,
    loading: boolean
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export const authReducer = createReducer(
    initialState,
    on(authenticateSuccess, (state, action) => {
        const user = new User(
            action.email,
            action.id,
            action.token,
            action.expirationDate
        );
        return {
            ...state,
            authError: null,
            user,
            loading: false
        }
    }),
    on(authenticateFail, (state, action) => {
        return {
            ...state,
            authError: action.message,
            loading: false
        }
    }),
    on(startSignup, (state, actions) => {
        return {
            ...state,
            authError: null,
            loading: true
        }
    }),
    on(startLogin, (state, action) => {
        return {
            ...state,
            authError: null,
            loading: true
        }
    }),
    on(logout, (state, action) => {
        return {
            ...state,
            user: null
        }
    }),
    on(clearError, (state, action) => {
        return {
            ...state,
            authError: null
        }
    })
)