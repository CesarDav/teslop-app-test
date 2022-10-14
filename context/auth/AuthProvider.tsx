import { FC, useEffect, useReducer } from 'react';

import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

import { IUser } from 'interfaces';
import { AuthContext, authReducer } from '.';
import { tesloApi } from 'api';


export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}



const Auth_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

interface Props {
    children: React.ReactNode
}

export const AuthProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
    const router = useRouter();
    const { data, status } = useSession();


    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
        }
    }, [status, data])

    // useEffect(() => {
    //     checkToken()
    // }, [])

    const checkToken = async () => {
        if (!Cookies.get('token')) return
        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;

            Cookies.set('token', token);

            dispatch({ type: '[Auth] - Login', payload: user })

        } catch (error) {
            Cookies.remove('token');
            console.log({ error })
        }
    }


    const logginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true

        } catch (error) {
            return false
        }
    }


    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {
        try {
            const { data } = await tesloApi.post('/user/register', { email, password, name });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });

            return {
                hasError: false,
                // message: 'Failed to create user - try again '
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const { message } = error.response?.data as { message: string }

                return {
                    hasError: true,
                    message
                }
            }

            return {
                hasError: true,
                message: 'Failed to create user - try again '
            }
        }
    }


    const logoutUser = () => {
        Cookies.remove('cart');
        Cookies.remove('paymentAddress');

        signOut()

        // Cookies.remove('token');
        // router.reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            // Methos
            logginUser,
            registerUser,
            logoutUser

        }}>
            {children}
        </AuthContext.Provider>
    )
}