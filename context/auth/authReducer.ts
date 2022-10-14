import { IUser } from 'interfaces';
import { AuthState } from '.';

// La funcion pura no tiene que ser asincrono.
// Se epsera que siempre regre un nuevo estado y no una mutacion del estado.

type AuthActionType =
    | { type: '[Auth] - Login', payload: IUser }
    | { type: '[Auth] - Logout' }

export const authReducer = (state: AuthState, action: AuthActionType): AuthState => {

    switch (action.type) {
        case '[Auth] - Login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }

        case "[Auth] - Logout":
            return {
                ...state,
                isLoggedIn: false,
                user: undefined,
            }

        default:
            return state
    }
}