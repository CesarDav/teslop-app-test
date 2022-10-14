import { NextPage } from "next"
import NextLink from 'next/link'

import { Box, Link, Typography } from "@mui/material"
import { RemoveShoppingCartOutlined } from "@mui/icons-material"


import { ShopLayout } from "components/layouts"

const EmptyPage: NextPage = () => {
    return (
        <ShopLayout title="Empty cart" pageDescription="No items in shopping cart ">
            <Box sx={{ flexDirection: { xs: 'column', sm: 'row' } }} display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>

                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography>Your cart is empty </Typography>
                    <NextLink href='/' passHref>
                        <Link typography='h4' color='secondary'>
                            Back
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}


export default EmptyPage
