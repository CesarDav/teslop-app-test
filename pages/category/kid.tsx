import type { NextPage } from 'next'

import { Typography } from '@mui/material'

import { ProductList } from 'components/products'
import { useProducts } from 'hooks'
import { FullScreenLoading } from 'components/ui'
import { ShopLayout } from 'components/layouts'



const KidPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kid')

    return (
        <ShopLayout title={'Teslo-shop - Kid '} pageDescription={'Kid products'} >
            <>
                <Typography variant='h1' component='h1'>Kid</Typography>
                <Typography variant='h2' sx={{ mb: 1 }}>Kid products</Typography>
                {
                    isLoading
                        ? <FullScreenLoading />
                        : <ProductList products={products} />
                }

            </>
        </ShopLayout>

    )
}

export default KidPage
