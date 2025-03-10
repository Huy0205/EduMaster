'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { useAuth } from '~/context/AuthContext';

const Header = () => {
    const { auth, setAuth } = useAuth();
    const { isAuth, user } = auth;
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const isDropdownOpen = Boolean(anchorEl);

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleProfileClick = () => {
        router.push('/profile');
        setAnchorEl(null);
    };
    const handleThongKe = () => {
        router.push('/tiendo');
        setAnchorEl(null);
    };
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        setAuth({ isAuth: false, user: null });
        localStorage.removeItem('access_token');
        setAnchorEl(null);
        router.push('/');
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="static"
            sx={{ bgcolor: 'gray.800' }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                >
                    <a href="/">EduMaster</a>
                </Typography>

                {/* Right Side: Conditional Rendering */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isAuth ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ color: 'white' }}>
                                    <span style={{ marginLeft: '8px' }}>
                                        Lớp: {user.currentGrade} |
                                    </span>
                                    {' ' + user.fullName}
                                </Typography>
                                <IconButton
                                    onClick={handleAvatarClick}
                                    color="inherit"
                                    sx={{ p: 0 }}
                                >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 35,
                                            height: 35,
                                            display: 'flex',
                                            placeContent: 'center',
                                        }}
                                    >
                                        {/* Ảnh bao quanh Avatar */}
                                        {user.frame && (
                                            <Box
                                                component="img"
                                                src={user.frame.url} // Sử dụng URL frame active
                                                alt="Overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '50%', // Ảnh overlay hình tròn
                                                    scale: '160%',
                                                    zIndex: 2, // Đặt ảnh overlay dưới avatar
                                                }}
                                            />
                                        )}
                                        <Avatar
                                            src={user.avatar}
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
                                    <span
                                        style={{
                                            color: '#23ff23',
                                            fontWeight: 'bold',
                                            marginLeft: 6,
                                        }}
                                    >
                                        {user.totalPoint}
                                    </span>
                                </MenuItem>
                                <MenuItem
                                    onClick={handleThongKe}
                                    sx={{ minWidth: 200, justifyContent: 'space-between' }}
                                >
                                    Thống kê
                                </MenuItem>
                                <MenuItem
                                    onClick={handleProfileClick}
                                    sx={{ minWidth: 200, justifyContent: 'space-between' }}
                                >
                                    Thông tin cá nhân
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{
                                        minWidth: 200,
                                        justifyContent: 'space-between',
                                        color: 'red',
                                    }}
                                >
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
