import { createAction, props } from "@ngrx/store";

export const authenticateSuccess = createAction(
    '[Auth] AUTHENTICATE_SUCCESS',
    props<{
        email: string,
        id: string,
        token: string,
        expirationDate: Date,
        redirect: boolean
    }>()
)

export const authenticateFail = createAction(
    '[Auth] AUTHENTICATE_FAIL',
    props<{
        message: string
    }>()
)

export const startSignup = createAction(
    '[Auth] START_SIGNUP',
    props<{
        email: string,
        password: string
    }>()
)

export const startLogin = createAction(
    '[Auth] START_LOGIN',
    props<{
        email: string,
        password: string
    }>()
)

export const logout = createAction(
    '[Auth] LOGOUT',
)

export const clearError = createAction(
    '[AUTH] CLEAR_ERROR'
)

export const autoLogin = createAction(
    '[Auth] AUTO_LOGIN'
)