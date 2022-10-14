import { FC, useEffect, useReducer } from 'react';

import Cookie from 'js-cookie'

import { ICartProduct } from 'interfaces';
import { CartContext, cartReducer } from '.';
import { IOrder, ShippingAddress } from 'interfaces/order';
import { tesloApi } from 'api';
import axios from 'axios';


export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number
    shippingAddress?: ShippingAddress
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,

}

interface Props {
    children: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);


    useEffect(() => {
        try {
            const cookieProduct = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: '[Cart] - LoadCart from cookkies | storage', payload: cookieProduct })

        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookkies | storage', payload: [] })
        }

    }, []);


    useEffect(() => {
        const data = JSON.parse(Cookie.get('paymentAddress') || '[]');
        if (data.name) {
            dispatch({ type: '[Cart] - LoadAddress from cookkies ', payload: data });
        }

    }, [])

    useEffect(() => {
        if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart]);


    useEffect(() => {

        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const ordersumary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)

        }

        dispatch({ type: '[Cart] - Update order summary', payload: ordersumary })
    }, [state.cart])



    const addProductToCart = (product: ICartProduct) => {
        // dispatch({ type: '[Cart] - Add Product', payload: product })

        const productInCart = state.cart.some(p => p._id === product._id)
        if (!productInCart) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] })

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButDifferentSize) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] })

        const updateProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            // update prodcut
            p.quantity += product.quantity;
            return p

        })

        dispatch({ type: '[Cart] - Update products in cart', payload: updateProducts })
    };


    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product })
    };


    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    };


    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('paymentAddress', JSON.stringify(address));
        dispatch({ type: '[Cart] - Update Shipping Address ', payload: address });


    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
        if (!state.shippingAddress) throw new Error("No delivery address");

        const body: IOrder = {
            orderItems: state.cart.map((p) => ({
                ...p,
                size: p.size!,
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        };

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);

            dispatch({ type: '[Cart] - Order complete ' });

            Cookie.set("cart", JSON.stringify([]));

            return {
                hasError: false,
                message: data._id!
            }



        } catch (error) {
            if (axios.isAxiosError(error)) {
                const { message } = error.response?.data as { message: string }
                return {
                    hasError: true,
                    message
                }
            };

            return {
                hasError: true,
                message: 'Uncontrolled error, contact an administrator'
            };
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            //methods
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
            createOrder
        }}>
            {children}
        </CartContext.Provider>
    )
}