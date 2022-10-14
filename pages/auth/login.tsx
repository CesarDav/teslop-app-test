import { useEffect, useState } from 'react';

import { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography, Chip, Divider } from '@mui/material';
import { useForm } from "react-hook-form";
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { signIn, getSession, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';


import { AuthLayout } from 'components/layouts'
import { validations } from 'utils';


type FormData = {
    email: string,
    password: string,
}

const LoginPage: NextPage = () => {
    const router = useRouter();

    const [showError, setShowError] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({});

    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>(null);

    // const { logginUser } = useContext(AuthContext);
    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov);
        })
    }, [])

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);

        // custom login
        // const isValidLogin = await logginUser(email, password);

        // if (!isValidLogin) {
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false);
        //     }, 3000);
        // };

        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });


    }
    return (
        <AuthLayout title='Log In'>
            <>
                <form onSubmit={handleSubmit(onLoginUser)} noValidate >

                    <Box sx={{ width: 350, padding: '10px 20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h1' component='h1'>Start session </Typography>

                                <Chip
                                    label="Incorrect username or password"
                                    color="error"
                                    icon={<ErrorOutline />}
                                    className="fadeIn"
                                    sx={{ display: showError ? 'flex' : 'none' }}
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
                                    Log In
                                </Button>
                            </Grid>

                            <Grid item xs={12} display='flex' justifyContent='end'>
                                <NextLink
                                    href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}
                                    passHref

                                >
                                    <Link

                                        underline='always'>
                                        Don t have an account yet ?
                                    </Link>
                                </NextLink>
                            </Grid>
                            {providers && (
                                <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                                    <>
                                        <Divider sx={{ width: '100%', mb: 2 }} />
                                        {
                                            Object.values(providers).map((provider) => {
                                                if (provider.type === 'credentials') return null;
                                                return (
                                                    <Button
                                                        key={provider.id}
                                                        fullWidth
                                                        color='primary'
                                                        sx={{ mb: 1 }}
                                                        variant='outlined'
                                                        onClick={() => signIn(provider.id)}
                                                    >
                                                        {provider.name}
                                                    </Button>
                                                );
                                            })
                                        }
                                    </>
                                </Grid>

                            )}
                        </Grid>
                    </Box>
                </form>
            </>
        </AuthLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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

export default LoginPage;
