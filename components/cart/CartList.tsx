import { FC, useContext } from 'react';

import NextLink from 'next/link';
import { Grid, Typography, Link, CardActionArea, CardMedia, Box, Button } from "@mui/material"

import { ItemCounter } from 'components/ui';
import { CartContext } from 'context';
import { ICartProduct, IOrderItem } from 'interfaces';


interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue
        updateCartQuantity(product)
    }

    const onRemoveProduct = (product: ICartProduct) => {
        removeCartProduct(product)
    }

    const productsToShow = products ? products : cart;

    return (
        <>
            {
                productsToShow.map((product) => (
                    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            <NextLink href={`/product/${product.slug}`} passHref>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            image={product.images}
                                            component='img'
                                            sx={{ borderRadius: '5px' }}

                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Size: <strong>{product.size}</strong></Typography>

                                {
                                    editable
                                        ? <ItemCounter maxValue={10} currentValue={product.quantity} updateQuantity={(newValue) => onNewCartQuantityValue(product as ICartProduct, newValue)} />
                                        : <Typography variant='h5'>{product.quantity} product{product.quantity > 1 ? 's' : ''}</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1'>${product.price}</Typography>

                            {
                                editable && (
                                    <Button onClick={() => onRemoveProduct(product as ICartProduct)} variant='text' color='secondary'>
                                        Remove
                                    </Button>
                                )
                            }

                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}
