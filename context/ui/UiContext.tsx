import { createContext } from 'react'


interface ContexProps {
    isMenuOpen: boolean;

    //methods
    toggleSideMenu: () => void
}


export const UiContext = createContext({} as ContexProps)