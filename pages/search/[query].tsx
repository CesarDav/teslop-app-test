import type { NextPage, GetServerSideProps } from 'next'

import { Typography, Box } from '@mui/material'

import { ProductList } from 'components/products'
import { ShopLayout } from 'components/layouts'
import { dbProducts } from 'database'
import { IProduct } from 'interfaces'


interface Props {
    products: IProduct[];
    foundProducts: boolean
    query: string;
}


const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
    return (
        <ShopLayout title={'Teslo-shop - Search'} pageDescription={'Search the best products here'} >
            <>
                <Typography variant='h1' component='h1'>Search product</Typography>
                {
                    foundProducts
                        ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>{query}</Typography>
                        : (
                            <Box display='flex'>
                                <Typography variant='h2' sx={{ mb: 1 }}>We did not find any product</Typography>
                                <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform='capitalize'>{query}</Typography>
                            </Box>
                        )
                }
                <ProductList products={products} />
            </>
        </ShopLayout>

    )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        };
    }

    let products = await dbProducts.getProductByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await dbProducts.getAllProduct();
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    };
}

export default SearchPage;