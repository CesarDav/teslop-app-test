import { db } from "database"
import { IProduct } from "interfaces";
import { Product } from "models";

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    if (!product) {
        return null
    }

    product.images = product.images.map((image) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    });


    return JSON.parse(JSON.stringify(product));
}

interface ProductSlug {
    slug: string
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await db.disconnect()

    return slugs;
};


export const getProductByTerm = async (term: string): Promise<IProduct[]> => {
    term = term.toLocaleString().toLocaleLowerCase()

    await db.connect()
    const products = await Product.find({
        $text: { $search: term }
    }).select('title images price slug inStock -_id')
        .lean()

    await db.disconnect();

    const updateProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product

    })

    return updateProducts;
}

export const getAllProduct = async (): Promise<IProduct[]> => {
    await db.connect();

    const products = await Product.find().lean();

    await db.disconnect();

    const updateProducts = products.map((product) => {
        product.images = product.images.map((image) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product

    });

    return JSON.parse(JSON.stringify(updateProducts))
}