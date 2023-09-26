import { Actions, createEffect, ofType } from "@ngrx/effects";
import { authenticateSuccess, authenticateFail, startLogin, startSignup, logout, autoLogin } from "./auth.actions";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { User } from "../user.model";

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string) => {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
        return authenticateSuccess({
            email: email,
            id: userId,
            token: token,
            expirationDate: expirationDate,
            redirect: true
        });
}

const handleError = (errorRes) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
        return of(authenticateFail({ message: errorMessage }));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
    }
    return of(authenticateFail({ message: errorMessage }));
}

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}

    authSignup = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(startSignup),
                switchMap((signupAction) => {
                    return this.http
                    .post<AuthResponseData>(
                        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseAPIKey,
                        {
                            email: signupAction.email,
                            password: signupAction.password,
                            returnSecureToken: true
                        }
                    )
                    .pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return handleAuthentication(
                                +resData.expiresIn,
                                resData.email,
                                resData.localId,
                                resData.idToken
                            );
                        }),
                        catchError(error => {
                            return handleError(error);
                        })
                    )
                })
            );
    })

    authLogin = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(startLogin),
                switchMap((loginAction) => {
                    return this.http
                        .post<AuthResponseData>(
                            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseAPIKey,
                            {
                                email: loginAction.email,
                                password: loginAction.password,
                                returnSecureToken: true
                            }
                        )
                        .pipe(
                            tap(resData => {
                                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                            }),
                            map(resData => {
                                return handleAuthentication(
                                    +resData.expiresIn,
                                    resData.email,
                                    resData.localId,
                                    resData.idToken
                                );
                            }),
                            catchError(error => {
                                return handleError(error);
                            }),
                        );
                })
            );
    })

    authSuccess = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(authenticateSuccess),
                tap((stateData) => {
                    if (stateData.redirect) {
                        this.router.navigate(['/']);
                    }
                })
            );
    }, {
        dispatch: false
    })

    authLogout = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(logout),
                tap(() => {
                    this.authService.clearLogoutTimer();
                    localStorage.removeItem('userData');
                    this.router.navigate(['/auth']);
                })
            );
    }, {
        dispatch: false
    })

    autoLogin = createEffect(() => {
        return this.actions$
            .pipe(
                ofType(autoLogin),
                switchMap(() => {
                        const userData: {
                            email: string;
                            id: string;
                            _token: string;
                            _tokenExpirationDate: string;
                        } = JSON.parse(localStorage.getItem('userData'));
                        
                        if (!userData) {
                            return of();
                        }
                    
                        const loadedUser = new User(
                            userData.email,
                            userData.id,
                            userData._token,
                            new Date(userData._tokenExpirationDate)
                        );
                    
                        if (loadedUser.token) {
                            const expirationDuration =
                                new Date(userData._tokenExpirationDate).getTime() -
                                new Date().getTime();
                            this.authService.setLogoutTimer(expirationDuration);
                            return of(authenticateSuccess({
                                email: loadedUser.email,
                                id: loadedUser.id,
                                token: loadedUser.token,
                                expirationDate: new Date(userData._tokenExpirationDate),
                                redirect: false
                            }));
                        }

                        return of();
                })
            );
    })
}