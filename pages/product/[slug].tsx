import { useContext, useState } from "react"

// import { useRouter } from "next/router"
import { GetStaticProps, NextPage, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import { Button, Grid, Typography, Box, Chip } from "@mui/material"


import { ShopLayout } from "components/layouts"
import { ProductSlideshow, SizeSelector } from "components/products"
import { ItemCounter } from "components/ui"
import { ICartProduct, IProduct, ISize } from "interfaces"
import { dbProducts } from "database"
import { CartContext } from '../../context/cart/CartContext';


interface Props {
    product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {
    const router = useRouter()
    // const { products: product, isLoading } = useProducts(`/products/${router.query}`);

    const { addProductToCart } = useContext(CartContext)

    const [tempCardProduct, setTempCardProduct] = useState<ICartProduct>({
        _id: product._id,
        images: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    });


    const onSelectSize = (size: ISize) => {
        setTempCardProduct(currentProduct => ({
            ...currentProduct,
            size
        }));
    }


    const updateQuantity = (quantity: number) => {

        setTempCardProduct(currentProduct => ({
            ...currentProduct,
            quantity
        }));


    }


    const onAddProduct = () => {
        if (!tempCardProduct.size) { return }
        addProductToCart(tempCardProduct)
        router.push('/cart');
    }


    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow
                        images={product.images}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle2' component='h2'>${product.price}</Typography>

                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2">Quantity</Typography>
                            <ItemCounter
                                maxValue={product.inStock}
                                currentValue={tempCardProduct.quantity}
                                updateQuantity={updateQuantity}

                            />
                            <SizeSelector
                                selectedSize={tempCardProduct.size}
                                sizes={product.sizes}
                                onSelectSize={onSelectSize}
                            />
                        </Box>

                        {/* agregar al carrito */}
                        {
                            product.inStock > 0 ? (
                                <Button onClick={onAddProduct} color="secondary" className="circular-btn">
                                    {
                                        tempCardProduct.size
                                            ? "Add to cart"
                                            : "Select a size"
                                    }

                                </Button>
                            ) : (
                                <Chip label="Not available" color="error" variant="outlined" />
                            )
                        }

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2">Description </Typography>
                            <Typography variant="body2">{product.description} </Typography>

                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )

}


// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const { slug = '' } = params as { slug: string };

//     const product = await dbProducts.getProductBySlug(slug);


//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
//             product
//         }
//     }

// }


export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const slugs = await dbProducts.getAllProductSlugs();


    return {
        paths: slugs.map(({ slug }) => ({
            params: { slug }

        }))
        ,
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {


    const { slug } = params as { slug: string };
    const product = await dbProducts.getProductBySlug(slug);

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 86400,
    }
}

export default ProductPage
