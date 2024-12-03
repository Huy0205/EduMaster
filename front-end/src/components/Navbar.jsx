'use client';
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', borderTop: '2px solid gray.200' }}>
    <Toolbar sx={{ justifyContent: 'center' }}>
      <a href="/ontap" style={{ textDecoration: 'none' }}>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'green.500', 
            color: 'white', 
            mx: 1, 
            fontWeight: 'bold', // Thêm độ đậm cho chữ
            fontSize: '16px', // Tăng kích thước chữ
            '&:hover': { bgcolor: 'green.400' } 
          }} 
        >
          Ôn Tập
        </Button>
      </a>
      <a href="/kiemtra" style={{ textDecoration: 'none' }}>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'green.500', 
            color: 'white', 
            mx: 1, 
            fontWeight: 'bold', 
            fontSize: '16px', 
            '&:hover': { bgcolor: 'green.400' } 
          }} 
        >
          Kiểm Tra
        </Button>
      </a>
      <a href="/doithuong" style={{ textDecoration: 'none' }}>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'green.500', 
            color: 'white', 
            mx: 1, 
            fontWeight: 'bold', 
            fontSize: '16px', 
            '&:hover': { bgcolor: 'green.400' } 
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
