import { UiState } from '.';

// La funcion pura no tiene que ser asincrono.
// Se epsera que siempre regre un nuevo estado y no una mutacion del estado.

type UiActionType =
    | { type: '[UI] - ToggleMenu', }

export const uiReducer = (state: UiState, action: UiActionType): UiState => {

    switch (action.type) {
        case '[UI] - ToggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }

        default:
            return state
    }
}