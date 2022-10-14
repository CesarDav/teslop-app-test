import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';

import { db } from 'database';
import { IProduct } from 'interfaces';
import { Product } from 'models';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');


type Data =
    | { message: string }
    | IProduct[]
    | IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' })
    }


}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    await db.disconnect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    await db.disconnect();


    const updateProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product

    })
    res.status(200).json(updateProducts);
}


const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId) return res.status(400).json({ message: 'The product id is not valid' });

    if (images.length < 2) return res.status(400).json({ message: 'At least two images are required' });


    try {
        await db.connect();
        const product = await Product.findById(_id);

        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'There is no product with this id' });
        }

        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                await cloudinary.uploader.destroy(fileId)
            }
        })

        await product.update(req.body);
        await db.disconnect();
        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'Check the server' });
    }

}


const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) return res.status(400).json({ message: 'The product needs at least two images' });

    try {
        await db.connect();

        const productInDB = await Product.findOne({ slug: req.body.slug });

        if (productInDB) {
            await db.disconnect();
            return res.status(400).json({ message: 'A product with this slug already exists' })
        }

        const product = new Product(req.body);

        await product.save();
        await db.disconnect();

        res.status(201).json(product);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Check the server' });

    }

}