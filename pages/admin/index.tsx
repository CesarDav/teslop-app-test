import { useEffect, useState } from 'react';

import { NextPage } from 'next';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';

import { AdminLayout } from 'components/layouts';
import { SummaryTitle } from 'components/admin';
import { DashboardSummaryResponse } from 'interfaces';

const DashboardPage: NextPage = () => {

    const [refreshIn, setRefresIn] = useState<number>(30)

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 segundos
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        }, 1000)
        return () => clearInterval(interval);
    }, [])


    if (!error && !data) {
        return <></>
    }

    if (error) {
        console.log(error);
        return <Typography>Error loading information</Typography>
    }


    const { numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoIventory,
        lowInvetory,
        notPaidOrders } = data!;

    return (
        <AdminLayout
            title='Dashboard'
            subTitle='General statistics'
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>
                <SummaryTitle
                    title={numberOfOrders}
                    subTitle={'Total Orders'}
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={paidOrders}
                    subTitle={'Paid orders '}
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={notPaidOrders}
                    subTitle={'Peding Orders'}
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={numberOfClients}
                    subTitle={'Clients'}
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={numberOfProducts}
                    subTitle={'Products'}
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={productsWithNoIventory}
                    subTitle={'No stock'}
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={lowInvetory}
                    subTitle={'Low inventory '}
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SummaryTitle
                    title={refreshIn}
                    subTitle={'Updating in : '}
                    icon={<AccessTimeOutlined color='error' sx={{ fontSize: 40 }} />}
                />
            </Grid>

        </AdminLayout>
    )
};

export default DashboardPage;
