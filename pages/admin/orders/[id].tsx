
import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Divider, Grid, Typography, Chip } from '@mui/material';
import { getSession } from 'next-auth/react';

import { AdminLayout, ShopLayout } from 'components/layouts';
import { CartList, OrderSummary } from 'components/cart';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from 'database';
import { IOrder } from 'interfaces';
import { countries } from 'utils';


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

const OrderDetailPage: NextPage<Props> = ({ order }) => {
    const { shippingAddress } = order;
    return (
        <AdminLayout
            title='Order detail'
            subTitle='Detail Order'
        >
            <>
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


                                <Box sx={{ mt: 3 }} display='flex' flexDirection="column">


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
                                                <Chip
                                                    sx={{ my: 2 }}
                                                    label="Pending payment"
                                                    variant='outlined'
                                                    color='error'
                                                    icon={<CreditCardOffOutlined />}
                                                />

                                            )
                                    }
                                </Box>


                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        </AdminLayout>
    )
};


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;


    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
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

export default OrderDetailPage;
