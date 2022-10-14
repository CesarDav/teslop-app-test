import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import { ProductList } from 'components/products'
import { useProducts } from 'hooks'
import { FullScreenLoading } from 'components/ui'
import { ShopLayout } from 'components/layouts'



const MenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=men')

    return (
        <ShopLayout title={'Teslo-shop - Men '} pageDescription={'Men products'} >
            <>
                <Typography variant='h1' component='h1'>Men</Typography>
                <Typography variant='h2' sx={{ mb: 1 }}>Men products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                }

            </>
        </ShopLayout>

    )
}

export default MenPage
