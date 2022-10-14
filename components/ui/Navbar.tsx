import { useContext, useState } from 'react';

import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { UiContext } from 'context';
import { CartContext } from '../../context/cart/CartContext';


export const Navbar = () => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)

    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext)


    const router = useRouter();




    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;

        router.push(`/search/${searchTerm}`);

    }



    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />


                <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}  >
                    <NextLink href='/category/men' passHref>
                        <Link>
                            <Button color={router.asPath === "/category/men" ? 'primary' : 'info'}>Men</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref>
                        <Link>
                            <Button color={router.asPath === "/category/women" ? 'primary' : 'info'}>Women</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref>
                        <Link>
                            <Button color={router.asPath === "/category/kid" ? 'primary' : 'info'}>kid</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />
                {/* desktop */}

                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className='fadeIn'
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Search..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        ) : (
                            <IconButton
                                className='fadeIn'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                onClick={() => setIsSearchVisible(true)}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* mobile */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart' passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary" >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={() => toggleSideMenu()} >
                    Menu
                </Button>
            </Toolbar>
        </AppBar>
    )
}
