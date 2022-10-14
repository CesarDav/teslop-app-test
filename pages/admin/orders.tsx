import { NextPage } from 'next';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';


import { AdminLayout } from 'components/layouts';
import useSWR from 'swr';
import { IOrder, IUser } from 'interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Last name', width: 250 },
    { field: 'total', headerName: 'Total amount ', width: 150 },
    {
        field: 'isPaid',
        headerName: 'Paid ',
        width: 150,
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid
                ? <Chip variant='outlined' label='Paid' color='success' />
                : (<Chip variant='outlined' label='Pending' color='error' />)

        }
    },
    { field: 'nProducts', headerName: 'N.Prodcuit ', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'View order',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel="noreferrer" >
                    view order
                </a>
            )

        }
    },
    { field: 'createAt', headerName: 'Creation date', width: 300 },

]


const OrdersPage: NextPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && !error) return <></>;


    const rows = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        nProducts: order.numberOfItems,
        createAt: order.createdAt
    }))

    return (
        <AdminLayout
            title='Orders'
            subTitle='Manager Orders'
            icon={<ConfirmationNumberOutlined />}
        >
            <>
                <Grid container className="fadeIn">
                    <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                        />
                    </Grid>
                </Grid>
            </>

        </AdminLayout>
    )
}


export default OrdersPage;