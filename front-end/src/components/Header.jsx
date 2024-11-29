"use client"
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
  const [grade, setGrade] = useState("");
  const [point, setPoint] = useState("");
  const [activeFrameUrl, setActiveFrameUrl] = useState("/iframe/img/default.png");

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
          const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
          const userData = userResponse.data.data;
          setName(userData.fullName || ""); // Cập nhật tên người dùng
          setAvatarUrl(userData.avatar || ""); // Cập nhật URL ảnh đại diện
          setGrade(userData.currentGrade);
          setPoint(userData.totalPoint || 0);

          // Gọi API để lấy avatar frame đang active
          const frameResponse = await axios.get(`http://localhost:8080/api/v1/avatar-frame-user/user/${userId}`);
          const activeFrame = frameResponse.data.data.find((frame) => frame.isActive);
          
          if (activeFrame) {
            setActiveFrameUrl(activeFrame.url); // Cập nhật URL ảnh bao quanh avatar
          }
        } catch (error) {
          console.error("Error fetching user data or active frame:", error);
          setName("Người dùng không tìm thấy"); // Thiết lập tên mặc định hoặc thông báo
          setAvatarUrl(""); // Có thể thiết lập một URL mặc định cho avatar nếu cần
          setActiveFrameUrl("/iframe/img/default.png"); // URL mặc định nếu không có frame active
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
        >
          <a href='/'>
            EduMaster
          </a>
        </Typography>

        {/* Right Side: Conditional Rendering */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loggedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: 'white' }}>
                  <span style={{ marginLeft: '8px' }}>Lớp: {grade} |</span> {name}
                </Typography>
                <IconButton onClick={handleAvatarClick} color="inherit" sx={{ p: 0 }}>
                  <Box sx={{ position: 'relative', width: 48, height: 48, display: 'flex', placeContent: 'center' }}>
                    {/* Ảnh bao quanh Avatar */}
                    <Box
                      component="img"
                      src={"/iframe/img/s3_3.png"} // Sử dụng URL frame active
                      alt="Overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%', // Ảnh overlay hình tròn
                        scale:"160%",
                        zIndex: 2, // Đặt ảnh overlay dưới avatar
                      }}
                    />
                    <Avatar
                      src={avatarUrl}
                      sx={{
                        position: 'absolute', // Đảm bảo avatar trùng khớp với overlay
                        top: 0,
                        left: 0,
                        width: '100%', // Kích thước avatar nhỏ hơn overlay để bên trong hoàn toàn
                        height: '100%',
                        zIndex: 1, // Avatar nằm trên ảnh overlay
                      }}
                    />
                  </Box>
                </IconButton>
              </Box>
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
                <MenuItem
                  sx={{
                    minWidth: 200,
                    justifyContent: 'flex-start',
                    cursor: 'default', // Không cho phép bấm
                    pointerEvents: 'none', // Vô hiệu hóa hoàn toàn click
                    borderBottom: '1px solid #ccc', // Đường gạch dưới
                    fontWeight: 'bold', // Làm nổi bật "Quý tộc"
                    color: 'black', // Màu chữ (tùy chỉnh)
                    backgroundColor: 'transparent', // Nền trong suốt
                  }}
                >
                  Điểm thưởng:
                  <span style={{ color: '#23ff23', fontWeight: 'bold', marginLeft: 6 }}>{point}</span>
                </MenuItem>
                <MenuItem onClick={handleProfileClick} sx={{ minWidth: 200, justifyContent: 'space-between' }}>
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ minWidth: 200, justifyContent: 'space-between', color: 'red' }}>
                  Đăng xuất
                </MenuItem>
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
