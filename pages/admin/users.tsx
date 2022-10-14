import { useEffect, useState } from 'react';


import { NextPage } from 'next';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';

import { AdminLayout } from 'components/layouts';
import { IUser } from 'interfaces';
import { tesloApi } from 'api';


const UserPage: NextPage = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    const { data, error } = useSWR<IUser[]>('/api/admin/users');

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data])


    if (!data && !error) return (<></>)

    const onRoleUpdate = async (userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({ ...user }));

        const updatedusers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role,
        }));
        setUsers(updatedusers);
        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers(previosUsers)
            alert('The user cannot be updated ');

        }

    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Full name', width: 300 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label='Role'
                        onChange={(e) => onRoleUpdate(row.id, e.target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>

                    </Select>
                )
            }
        },

    ]

    const rows = users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }))



    return (
        <AdminLayout
            title='Users'
            subTitle='Manager Users'
            icon={<PeopleOutline />}
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


export default UserPage