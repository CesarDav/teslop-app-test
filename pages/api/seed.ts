import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from 'database'
import { Order, Product, User } from 'models'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'You do not have permission to perform this operation' })
    }
    await db.connect()

    await User.deleteMany();
    await User.insertMany(seedDatabase.initialData.users);

    // /// Si no se coloca niguna condicion,este eliminara todo los datos de la coleccion
    await Product.deleteMany();
    await Product.insertMany(seedDatabase.initialData.products);

    await Order.deleteMany();

    await db.disconnect();


    res.status(200).json({ message: 'ok ' });
}