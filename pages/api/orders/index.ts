import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { IOrder } from 'interfaces';
import { db } from 'database';
import { Order, Product } from 'models';

type Data =
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }


}


const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    // verificar que tengamos un usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: "You must be authenticated to perform this operation. " })
    }

    // crear un arreglo con los productos que las personas quieren
    const productsIds = orderItems.map((product) => product._id);
    await db.connect();

    // obtenemos todos los productos de la base de datos por el id
    const dbProducts = await Product.find({ _id: { $in: productsIds } });


    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
            if (!currentPrice) {
                throw new Error("Check the shopping cart again, product does not exist. ");
            }

            return (currentPrice * current.quantity) + prev

        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal) {
            throw new Error("Total is not equal to the amount");
        }

        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100) / 100;
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json(newOrder);


    } catch (error: any) {
        await db.disconnect()
        console.log(error);
        return res.status(400).json({
            message: error.message || 'check log server'
        });

    }



}