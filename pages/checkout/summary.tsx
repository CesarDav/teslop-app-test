import { useContext, useEffect, useState } from 'react';

import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link, Chip } from '@mui/material';

import { ShopLayout } from 'components/layouts';
import { CartList, OrderSummary } from 'components/cart';
import { CartContext } from 'context';
import { countries } from 'utils';
import Cookies from 'js-cookie';

const SummaryPage: NextPage = () => {
    const router = useRouter()
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [errorMessage, setErroMessage] = useState<string>('');


    useEffect(() => {
        if (!JSON.parse(Cookies.get('paymentAddress') || '[]')?.name) {
            router.push('/checkout/address');
        }

        // console.log()
    }, [router]);


    const onCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, message } = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErroMessage(message);
            return;
        };
        router.replace(`/orders/${message}`);

    };

    if (!shippingAddress) {
        return <></>;
    }

    const { name, address, phone, address2 = '', lastname, country, city, zip } = shippingAddress;

    return (
        <ShopLayout title='Order summary ' pageDescription='Order summary'>
            <>
                <Typography variant='h1' component='h1'>Order summary</Typography>
                <Grid container>
                    <Grid item xs={12} sm={7} >
                        <CartList />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant='h2'> Summary ({numberOfItems} {numberOfItems > 1 ? 'products' : 'product'})</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Box display='flex' justifyContent='end'>
                                    <NextLink href='/checkout/address' passHref>
                                        <Link underline='always'>
                                            Edit
                                        </Link>
                                    </NextLink>
                                </Box>
                                <Typography variant='subtitle1'>Delivery address</Typography>
                                <Typography>{name} {lastname}</Typography>
                                <Typography>{address}{address2}</Typography>
                                <Typography> {city} - {zip} </Typography>
                                <Typography> {countries.find((c) => c.code === country)?.name} </Typography>
                                <Typography>{phone}</Typography>


                                <Divider sx={{ my: 1 }} />
                                <Box display='flex' justifyContent='end'>
                                    <NextLink href='/cart' passHref>
                                        <Link underline='always'>
                                            Edit
                                        </Link>
                                    </NextLink>
                                </Box>
                                <OrderSummary />
                                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                    <Button
                                        color='secondary'
                                        className='circular-btn'
                                        fullWidth
                                        onClick={onCreateOrder}
                                        disabled={isPosting}
                                    >
                                        Confirm Order
                                    </Button>
                                    <Chip
                                        color='error'
                                        label={errorMessage}
                                        sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}

                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        </ShopLayout>
    )
}

export default SummaryPage
