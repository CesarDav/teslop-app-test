import type { NextApiRequest, NextApiResponse } from 'next';

import { db, dbOrders, dbProducts, dbUser } from 'database';
import { Order, Product, User } from 'models';



type Data =
    | { message: string }
    | {
        numberOfOrders: number;
        paidOrders: number; // isPad true
        notPaidOrders: number;
        numberOfClients: number; //role :client
        numberOfProducts: number;
        productsWithNoIventory: number;// 0
        lowInvetory: number;// productos con 10 o menos 
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getDahsboardStatistics(req, res)

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
    // res.status(200).json({ message: 'Example' })
}


const getDahsboardStatistics = async (req: NextApiRequest, res: NextApiResponse<Data>) => {


    // Primera forma de hacerlo segun el profresor
    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count(); 


    // Segunda forma de hacer segun el profresor

    // const [
    //     numberOfOrders,
    //     paidOrders,
    //     numberOfClients,
    //     numberOfProducts,
    //     productsWithNoIventory,
    //     lowInvetory,
    // ] = await Promise.all([
    //     Order.count(),
    //     Order.find({ isPaid: true }).count(),
    //     User.find({ role: 'client' }).count(),
    //     Product.count(),
    //     Product.find({ inStock: 0 }).count(),
    //     Product.find({ inStock: { $lte: 10 } }).count(),
    // ]);


    // res.status(200).json({
    //     numberOfOrders,
    //     paidOrders,
    //     numberOfClients,
    //     numberOfProducts,
    //     productsWithNoIventory,
    //     lowInvetory,
    //     notPaidOrders: numberOfOrders - paidOrders
    // })


    await db.connect();

    // obtener todo las orderdenes de la base de datos 
    const orders = await dbOrders.getAllOrders();


    // obtener todo los usuarios por el rol deseado 
    const usersClients = await dbUser.getUsersByRole('client');

    // obtener todo los productos 
    const products = await dbProducts.getAllProduct();

    await db.disconnect();
    const data = {
        numberOfOrders: orders?.length || 0,
        paidOrders: orders?.filter((order) => order.isPaid).length || 0, // isPad true
        notPaidOrders: orders?.filter(order => !order.isPaid).length || 0,
        numberOfClients: usersClients?.length || 0, //role :client
        numberOfProducts: products.length,
        productsWithNoIventory: products.filter(product => product.inStock === 0).length,// 0
        lowInvetory: products.filter(product => product.inStock > 0 && product.inStock <= 10).length,
    };


    res.status(200).json(data)


} 