import { useContext, useState } from 'react';

import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { getSession, signIn } from 'next-auth/react';



import { AuthContext } from 'context';
import { AuthLayout } from 'components/layouts';
import { validations } from 'utils';

interface FormData {
    name: string;
    email: string;
    password: string;
}


const RegisterPage: NextPage = () => {
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({});
    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const destination = router.query.p?.toString() || '/';
    const onRegisterUser = async ({ email, name, password }: FormData) => {
        setShowError(false);

        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!)
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);
        await signIn('credentials', { email, password });
    };




    return (
        <AuthLayout title='Registration'>
            <>
                <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                    <Box sx={{ width: 350, padding: '10px 20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h1' component='h1'>Register </Typography>

                                <Chip
                                    label="Error registering user "
                                    color="error"
                                    icon={<ErrorOutline />}
                                    className="fadeIn"
                                    sx={{ display: showError ? 'flex' : 'none' }}
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    variant='filled'
                                    fullWidth
                                    {...register('name', {
                                        required: 'This field is required',
                                        minLength: { value: 2, message: 'minimum 2 characters' }
                                    })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type='email'
                                    label="Email"
                                    variant='filled'
                                    fullWidth
                                    {...register('email', {
                                        required: 'This field is required',
                                        validate: validations.isEmail
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    variant='filled'
                                    type='password'
                                    fullWidth
                                    {...register('password', {
                                        required: 'This field is required',
                                        minLength: { value: 6, message: 'minimum 6 characters' }
                                    })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}

                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                                    Create Account
                                </Button>
                            </Grid>

                            <Grid item xs={12} display='flex' justifyContent='end'>
                                <NextLink
                                    href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                                >
                                    <Link
                                        underline='always' >
                                        Do you already have an account?
                                    </Link>
                                </NextLink>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </>
        </AuthLayout>
    )
};


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });
    const { p = '/' } = query;
    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}


export default RegisterPage
