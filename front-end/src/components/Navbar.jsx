'use client';
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { usePathname } from 'next/navigation'; // Import usePathname thay vì useRouter

const Navbar = () => {
  const pathname = usePathname(); // Lấy pathname

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', borderTop: '2px solid gray.200' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        {/* Nút Ôn Tập */}
        <a href="/ontap" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: (pathname.startsWith('/ontap') || pathname === '/' || pathname === '/profile' || pathname === '/tiendo') ? 'green.500' : 'grey.300', // Kiểm tra nếu đang ở trang /ontap hoặc trang con của nó
              color: 'white',
              mx: 1,
              fontWeight: 'bold',
              fontSize: '16px',
              '&:hover': { bgcolor: pathname.startsWith('/ontap') ? 'green.400' : 'grey.400' }, // Hiệu ứng hover tùy vào trang
            }}
          >
            Ôn Tập
          </Button>
        </a>

        {/* Nút Kiểm Tra */}
        <a href="/kiemtra" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: (pathname.startsWith('/kiemtra') || pathname === '/' || pathname === '/profile' || pathname === '/tiendo') ? 'green.500' : 'grey.300', // Kiểm tra nếu đang ở trang /kiemtra hoặc trang con của nó
              color: 'white',
              mx: 1,
              fontWeight: 'bold',
              fontSize: '16px',
              '&:hover': { bgcolor: pathname.startsWith('/kiemtra') ? 'green.400' : 'grey.400' }, // Hiệu ứng hover tùy vào trang
            }}
          >
            Kiểm Tra
          </Button>
        </a>

        {/* Nút Đổi Thưởng */}
        <a href="/doithuong" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: (pathname.startsWith('/doithuong')|| pathname === '/' || pathname === '/profile' || pathname === '/tiendo') ? 'green.500' : 'grey.300', // Kiểm tra nếu đang ở trang /doithuong hoặc trang con của nó
              color: 'white',
              mx: 1,
              fontWeight: 'bold',
              fontSize: '16px',
              '&:hover': { bgcolor: pathname.startsWith('/doithuong') ? 'green.400' : 'grey.400' }, 
            }}
          >
            Đổi Thưởng
          </Button>
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
