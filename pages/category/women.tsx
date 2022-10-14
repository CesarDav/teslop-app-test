import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import { ProductList } from 'components/products'
import { useProducts } from 'hooks'
import { FullScreenLoading } from 'components/ui'
import { ShopLayout } from 'components/layouts'



const WomenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=women')

    return (
        <ShopLayout title={'Teslo-shop - Women '} pageDescription={'Women products'} >
            <>
                <Typography variant='h1' component='h1'>Women</Typography>
                <Typography variant='h2' sx={{ mb: 1 }}>Women products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                }

            </>
        </ShopLayout>

    )
}

export default WomenPage
