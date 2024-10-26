'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '~/context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import axios from 'axios';

const Header = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const isDropdownOpen = Boolean(anchorEl);
  const [name, setName] = useState(""); // State để lưu tên người dùng
  const [avatarUrl, setAvatarUrl] = useState(""); // State để lưu URL ảnh đại diện
  const [userId, setUserId] = useState(null); // State để lưu userId

  useEffect(() => {
    // Kiểm tra xem mã có đang chạy ở phía client hay không
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId); // Lưu userId vào state
      const storedLoggedIn = localStorage.getItem('loggedIn');
      setLoggedIn(storedLoggedIn === 'true');
    }
  }, [setLoggedIn]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
          const userData = response.data.data;
          setName(userData.fullName || ""); // Cập nhật tên người dùng
          setAvatarUrl(userData.avatar || ""); // Cập nhật URL ảnh đại diện
        } catch (error) {
          console.error("Error fetching user data:", error);
          setName("Người dùng không tìm thấy"); // Thiết lập tên mặc định hoặc thông báo
          setAvatarUrl(""); // Có thể thiết lập một URL mặc định cho avatar nếu cần
        }
      }
    };

    fetchUserData(); // Gọi API khi userId thay đổi
  }, [userId]); // Chạy lại effect khi userId thay đổi

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setAnchorEl(null);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId'); // Xóa userId khi đăng xuất
    setAnchorEl(null);
    router.push('/');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'gray.800' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          EduMaster
        </Typography>

        {/* Right Side: Conditional Rendering */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loggedIn ? (
            <>
            <Typography sx={{ color: 'white', marginLeft: 1 }}>{name}</Typography> {/* Tên người dùng được đặt sau avatar */}
              <IconButton onClick={handleAvatarClick} color="inherit">
                <Avatar src={avatarUrl || "default-avatar.png"} /> {/* Sử dụng URL từ API cho Avatar */}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={handleLoginClick}
              variant="contained"
              color="primary"
              sx={{ bgcolor: 'blue.600' }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
