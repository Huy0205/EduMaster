'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Button } from '@mui/material';

const Navbar = () => {
  const router = useRouter();

  const handleVaoHocClick = () => {
    router.push('/baihoc');
  };

  const handleOnTapClick = () => {
    router.push('/ontap');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', borderTop: '2px solid gray.200' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Button 
          onClick={handleVaoHocClick} 
          variant="contained" 
          sx={{ bgcolor: 'green.500', color: 'white', mx: 1, '&:hover': { bgcolor: 'green.400' } }} 
        >
          Vào học
        </Button>
        <Button 
          onClick={handleOnTapClick} 
          variant="contained" 
          sx={{ bgcolor: 'green.500', color: 'white', mx: 1, '&:hover': { bgcolor: 'green.400' } }} 
        >
          Ôn Tập
        </Button>
        <Button 
          onClick={handleVaoHocClick} 
          variant="contained" 
          sx={{ bgcolor: 'green.500', color: 'white', mx: 1, '&:hover': { bgcolor: 'green.400' } }} 
        >
          Kiểm Tra
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
