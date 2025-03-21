'use client';
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation'; // Import usePathname thay vì useRouter

import { useAuth } from '~/context/AuthContext';

const Navbar = () => {
    const pathname = usePathname(); // Lấy pathname
    const router = useRouter();

    const { auth, isLoadingAuth } = useAuth();

    const navigate = (pathname) => {
        if (!auth.user) {
            router.push('/login');
        } else {
            router.push(pathname);
        }
    };

    return (
        <AppBar
            position="static"
            sx={{ bgcolor: 'white', borderTop: '2px solid gray.200' }}
        >
            <Toolbar sx={{ justifyContent: 'center' }}>
                {!isLoadingAuth && (
                    <>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor:
                                    pathname.startsWith('/ontap') ||
                                    pathname === '/' ||
                                    pathname === '/profile' ||
                                    pathname === '/tiendo'
                                        ? 'green.500'
                                        : 'grey.300', // Kiểm tra nếu đang ở trang /ontap hoặc trang con của nó
                                color: 'white',
                                mx: 1,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                '&:hover': {
                                    bgcolor: pathname.startsWith('/ontap')
                                        ? 'green.400'
                                        : 'grey.400',
                                }, // Hiệu ứng hover tùy vào trang
                            }}
                            onClick={() => navigate('/ontap')}
                        >
                            Vào học
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor:
                                    pathname.startsWith('/kiemtra') ||
                                    pathname === '/' ||
                                    pathname === '/profile' ||
                                    pathname === '/tiendo'
                                        ? 'green.500'
                                        : 'grey.300', // Kiểm tra nếu đang ở trang /kiemtra hoặc trang con của nó
                                color: 'white',
                                mx: 1,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                '&:hover': {
                                    bgcolor: pathname.startsWith('/kiemtra')
                                        ? 'green.400'
                                        : 'grey.400',
                                }, // Hiệu ứng hover tùy vào trang
                            }}
                            onClick={() => navigate('/kiemtra')}
                        >
                            Kiểm Tra
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor:
                                    pathname.startsWith('/doithuong') ||
                                    pathname === '/' ||
                                    pathname === '/profile' ||
                                    pathname === '/tiendo'
                                        ? 'green.500'
                                        : 'grey.300', // Kiểm tra nếu đang ở trang /doithuong hoặc trang con của nó
                                color: 'white',
                                mx: 1,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                '&:hover': {
                                    bgcolor: pathname.startsWith('/doithuong')
                                        ? 'green.400'
                                        : 'grey.400',
                                },
                            }}
                            onClick={() => navigate('/doithuong')}
                        >
                            Đổi Thưởng
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
