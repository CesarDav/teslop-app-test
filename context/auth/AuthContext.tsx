import { createContext } from 'react';


import { IUser } from 'interfaces';


interface ContexProps {
    isLoggedIn: boolean;
    user?: IUser;

    // Methods
    logginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{
        hasError: boolean;
        message?: string;
    }>;
    logoutUser: () => void
}


export const AuthContext = createContext({} as ContexProps)