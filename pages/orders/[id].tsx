import { useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { ShopLayout } from 'components/layouts';
import { CartList, OrderSummary } from 'components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from 'database';
import { IOrder } from 'interfaces';
import { countries } from 'utils';
import { tesloApi } from 'api';


export type OrderResponseBody = {
    id: string;
    status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";

};

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const [isPaying, setIsPaying] = useState<boolean>(false);

    const router = useRouter();
    const { shippingAddress } = order;

    const onOrderComplete = async (detail: OrderResponseBody) => {

        if (detail.status !== 'COMPLETED') return alert('No paypal payment');
        setIsPaying(true);

        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: detail.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false)
            console.log(error);
            alert('Error')
        }
    };

    return (
        <ShopLayout title='Order summary ' pageDescription='Order summary'>
            <>
                <Typography variant='h1' component='h1'>Order:{order._id}</Typography>
                {
                    order.isPaid
                        ? (
                            <Chip
                                sx={{ my: 2 }}
                                label="The order has been paid"
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined />}
                            />
                        )
                        : (

                            <Chip
                                sx={{ my: 2 }}
                                label="Pending payment"
                                variant='outlined'
                                color='error'
                                icon={<CreditCardOffOutlined />}
                            />
                        )

                }
                <Grid container className='fadeIn'>
                    <Grid item xs={12} sm={7} >
                        <CartList products={order.orderItems} />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Card className='summary-card'>
                            <CardContent>
                                <Typography variant='h2'> Summary ({order.numberOfItems}{order.numberOfItems > 1 ? 'products' : 'product'})</Typography>
                                <Divider sx={{ my: 1 }} />

                                <Box display='flex' justifyContent='space-between'>
                                    <Typography variant='subtitle1'>Delivery address</Typography>
                                </Box>

                                <Typography>{shippingAddress.name} {shippingAddress.lastname}</Typography>
                                <Typography>{shippingAddress.address} {shippingAddress.address2 ? shippingAddress.address2 : ''} </Typography>
                                <Typography> {shippingAddress.city}, {shippingAddress.zip} </Typography>
                                <Typography> {countries.find((c) => c.code === shippingAddress.country)?.name} </Typography>
                                <Typography>{shippingAddress.phone}</Typography>

                                <Divider sx={{ my: 1 }} />

                                <OrderSummary
                                    numberOfItemsProp={order.numberOfItems}
                                    totalProp={order.total}
                                    subTotalProp={order.subTotal}
                                    taxProp={order.tax}
                                />
                                <Box sx={{ mt: 3 }} display="flex" flexDirection="column">


                                    <Box
                                        display='flex'
                                        justifyContent='center'
                                        className='fadeIn'
                                        sx={{ display: isPaying ? 'flex' : 'none' }}
                                    >
                                        <CircularProgress />
                                    </Box>

                                    <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">


                                        {
                                            order.isPaid
                                                ? (
                                                    <Chip
                                                        sx={{ my: 2 }}
                                                        label="The order has been paid "
                                                        variant='outlined'
                                                        color='success'
                                                        icon={<CreditScoreOutlined />}
                                                    />

                                                ) : (

                                                    <PayPalButtons
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            value: order.total.toString(),
                                                                        },
                                                                    },
                                                                ],
                                                            });
                                                        }}
                                                        onApprove={(data, actions) => {
                                                            return actions.order!.capture().then((details: any) => {

                                                                onOrderComplete(details)

                                                            });
                                                        }}
                                                    />
                                                )
                                        }
                                    </Box>
                                    {/* <Button color='secondary' className='circular-btn' fullWidth>
                                        Confirm Order
                                    </Button> */}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        </ShopLayout>
    )
};


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/order/history',
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: '/order/history',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage
