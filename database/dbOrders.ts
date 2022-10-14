import { isValidObjectId } from "mongoose";


import { db } from "database";
import { IOrder } from "interfaces";
import { Order } from "models";


export const getAllOrders = async (): Promise<IOrder[] | null> => {
    await db.connect();
    const orders = await Order.find().lean();


    if (!orders) return null;

    return JSON.parse(JSON.stringify(orders));

}


export const getOrderById = async (id: string): Promise<IOrder | null> => {
    if (!isValidObjectId(id)) return null;


    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();

    if (!order) return null;

    return JSON.parse(JSON.stringify(order));

};


export const gerOrdersByUser = async (userId: string): Promise<IOrder[] | null> => {
    if (!isValidObjectId(userId)) return [];

    await db.connect();
    const orders = await Order.find({ user: userId }).lean();
    await db.disconnect();

    if (!orders) return [];

    return JSON.parse(JSON.stringify(orders));

}