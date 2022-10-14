import { db, SHOP_CONSTANTS } from 'database'
import { IProduct } from 'interfaces'
import { Product } from 'models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | { message: string }
    | IProduct[]

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

        default:
            return res.status(400).json({
                message: "Bad request"
            })
    }

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { gender = 'all' } = req.query;

    let condicion = {};

    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        condicion = { gender }
    }

    await db.connect();
    const products = await Product.find(condicion).select('title images price inStock slug -_id').lean();
    await db.disconnect();


    const updateProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product

    });

    return res.status(200).json(updateProducts)

}
