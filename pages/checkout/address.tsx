
import { useContext, useEffect, useState } from "react";

import { NextPage } from "next";
import { Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { ShopLayout } from "components/layouts"
import { Box } from "@mui/system";
import { countries } from "utils";
import { CartContext } from "context";



interface FormData {
    name: string;
    lastname: string;
    address: string;
    address2?: string;
    zip: string,
    city: string;
    country: string;
    phone: string;


}

const getAddressFromCookies = (): FormData => {
    const data = JSON.parse(Cookies.get('paymentAddress') || '[]');

    return {
        name: data.name || '',
        lastname: data.lastname || '',
        address: data.address || '',
        address2: data.address2 || '',
        zip: data.zip || '',
        city: data.city || '',
        country: data.country || '',
        phone: data.phone || '',

    }
}

const AddressPage: NextPage = () => {
    const router = useRouter();

    const { updateAddress } = useContext(CartContext);

    const [defaultCountry, setDefaultCountry] = useState('');


    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies(),
    });

    useEffect(() => {
        const address = getAddressFromCookies();
        reset(address);
        setDefaultCountry(address.country);
    }, [reset])

    const onSubmit = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary')

    }

    return (
        <ShopLayout title="Direction" pageDescription="Confirm destination address ">
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography variant="h1" component='h1'>Direction</Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='name'
                                variant='filled'
                                fullWidth
                                {...register('name', {
                                    required: 'The name is required'
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='lastname'
                                variant='filled'
                                fullWidth
                                {...register('lastname', {
                                    required: 'The lastname is required'
                                })}
                                error={!!errors.lastname}
                                helperText={errors.lastname?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='address 1'
                                variant='filled'
                                fullWidth
                                {...register('address', {
                                    required: 'address is required'
                                })}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='address 2'
                                variant='filled'
                                fullWidth
                                {...register('address2')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='zip code'
                                variant='filled'
                                fullWidth
                                {...register('zip', {
                                    required: 'zip code is required'
                                })}
                                error={!!errors.zip}
                                helperText={errors.zip?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='city'
                                variant='filled'
                                fullWidth
                                {...register('city', {
                                    required: 'city is required'
                                })}
                                error={!!errors.city}
                                helperText={errors.city?.message}

                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField
                                    key={defaultCountry}
                                    select
                                    defaultValue={defaultCountry}
                                    variant="filled"
                                    label='Country'
                                    {...register('country')}
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                >
                                    {
                                        countries.map((contry) => (
                                            <MenuItem
                                                value={contry.code}
                                                key={contry.code}
                                            >
                                                {contry.name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='phone'
                                variant='filled'
                                fullWidth
                                {...register('phone', {
                                    required: 'phone is required',
                                    minLength: { value: 7, message: 'the number must be at least 7 digits long.' }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                        <Button type="submit" color="secondary" className="circular-btn" size="large">
                            Check order
                        </Button>
                    </Box>
                </form>
            </>
        </ShopLayout>
    )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req: { cookies } }) => {
//     const { token = '' } = cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage
