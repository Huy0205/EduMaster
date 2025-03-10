'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';
import Header from '../../components/Header';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Avatar,
    MenuItem,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useAuth } from '~/context/AuthContext';
import Navbar from '~/components/Navbar';
import { putApiNoneToken, postApiNoneToken } from '~/api/page';
import { useRouter } from 'next/navigation';
import Loading from '../admin/components/loading';
const ProfilePage = () => {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const { auth, setAuth, isLoadingAuth } = useAuth();
    const { user } = auth;

    const router = useRouter();

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            setAvatar(user.avatar);
            setName(user.fullName);
            setGrade(user.currentGrade);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingAuth, user]);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
                setFeedbackMessage('Đã thay đổi ảnh đại diện');
                setTimeout(() => setFeedbackMessage(''), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCan = () => {
        setPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordError('');
    };
    const handleSave = async () => {
        const updatedUserData = {
            fullName: name,
            currentGrade: grade,
        };
        try {
            const updateRes = await putApiNoneToken(`user/update/${user.id}`, updatedUserData);
            const { data, message } = updateRes.data;
            if (data) {
                setAuth({
                    isAuth: true,
                    user: {
                        ...user,
                        fullName: data.fullName,
                        currentGrade: data.currentGrade,
                    },
                });
                setIsEditing(false);
                setFeedbackMessage('Thông tin người dùng đã được cập nhật thành công!');
            } else {
                console.error('Error updating user:', message);
            }
        } catch (error) {
            console.error(`Error updating user with id ${user.id}:`, error);
            setFeedbackMessage('Cập nhật không thành công.');
        }
    };
    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Nhập đầy đủ thông tin');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Mật khẩu mới và mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            // Kiểm tra mật khẩu cũ trước khi thay đổi
            const checkPasswordResponse = await postApiNoneToken('user/check-password', {
                email: user.email,
                password: oldPassword, // oldPassword là mật khẩu cũ
            });

            if (checkPasswordResponse.status === 200) {
                // Mật khẩu cũ hợp lệ, tiến hành thay đổi mật khẩu
                setLoading(true);
                const response = await putApiNoneToken(`user/update/${user.id}`, {
                    password: newPassword, // mật khẩu mới
                });
                console.log(response.status === 200);
                if (response.status === 200) {
                    setFeedbackMessage('Đổi mật khẩu thành công!');
                    setPasswordModalOpen(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setPasswordError('');
                    localStorage.removeItem('access_token');
                    setAuth({
                        isAuth: false,
                        user: null,
                    });
                    router.push('/login');
                    setLoading(false);
                }
            } else {
                setPasswordError('Mật khẩu cũ không chính xác!');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Mật khẩu cũ không chính xác!');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/img/bg-quiz.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Header />
            <Navbar />

            {isLoadingAuth || loading ? (
                <div className="w-screen h-screen flex-1 flex justify-center items-center">
                    <Loading />
                </div>
            ) : user ? (
                <Box
                    sx={{
                        maxWidth: '600px',
                        mx: 'auto',
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                        marginTop: 10,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2,
                            position: 'relative',
                        }}
                    >
                        {user.frame ? (
                            <img
                                src={user.frame.url}
                                alt="User frame"
                                style={{
                                    position: 'absolute',
                                    width: 180,
                                    height: 180,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 2,
                                    pointerEvents: 'none',
                                }}
                            />
                        ) : null}
                        <IconButton onClick={handleAvatarClick}>
                            <Avatar
                                alt="User avatar"
                                src={avatar}
                                sx={{ width: 100, height: 100, cursor: 'pointer', zIndex: 1 }}
                            />
                        </IconButton>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </Box>
                    <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        className="text-black"
                    >
                        Thông tin người dùng
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                    >
                        <TextField
                            label="Tên"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                startAdornment: <FaUser className="mr-2" />,
                                disabled: !isEditing,
                            }}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={user.email}
                            InputProps={{
                                startAdornment: <FaEnvelope className="mr-2" />,
                                disabled: true,
                            }}
                        />
                        <TextField
                            label="Số điện thoại"
                            fullWidth
                            margin="normal"
                            value={user.phoneNumber}
                            InputProps={{
                                startAdornment: <FaPhone className="mr-2" />,
                                disabled: true,
                            }}
                        />
                        <TextField
                            label="Lớp"
                            fullWidth
                            margin="normal"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            select
                            InputProps={{
                                startAdornment: <FaGraduationCap className="mr-2" />,
                                disabled: !isEditing,
                            }}
                        >
                            <MenuItem value="">Chọn Lớp</MenuItem>
                            {[...Array(5)].map((_, i) => (
                                <MenuItem
                                    key={i}
                                    value={i + 1}
                                >
                                    Lớp {i + 1}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        {isEditing ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
                                Lưu
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setPasswordModalOpen(true)}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Box>
                    {feedbackMessage && (
                        <Alert
                            severity="info"
                            sx={{ mt: 3 }}
                        >
                            {feedbackMessage}
                        </Alert>
                    )}
                </Box>
            ) : null}
            <Dialog
                open={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            >
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Mật khẩu cũ"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    {passwordError && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {passwordError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCan}
                        color="secondary"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handlePasswordChange}
                        color="primary"
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfilePage;
