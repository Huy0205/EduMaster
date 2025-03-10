'use client';
import { useState, useEffect } from 'react';
import { Box, Avatar, Button, Typography, Grid } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import { Snackbar, Alert } from '@mui/material';
import { getApiNoneToken, putApiNoneToken, postApiNoneToken } from '~/api/page';
import { useAuth } from '~/context/AuthContext';
import Loading from '../admin/components/loading';
import { useRouter } from 'next/navigation';

const DoiThuong = () => {
    const router = useRouter();

    const { auth, setAuth, isLoadingAuth } = useAuth();
    const { user, isAuth } = auth;

    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            if (user) {
                try {
                    const framesResponse = await getApiNoneToken('avatar-frame/list');
                    const framesData = framesResponse.data.data;

                    const frameUserResponse = await getApiNoneToken(
                        `avatar-frame-user/user/${user.id}`,
                    );
                    const frameUserData = frameUserResponse.data.data;

                    const updatedFrames = framesData.map((frame) => ({
                        ...frame,
                        isBlock: !frameUserData.some(
                            (userFrame) => userFrame.avatarFrameId === frame.id,
                        ),
                    }));
                    setFrames(updatedFrames);
                } catch (error) {
                    setError('Error:', error);
                }
                setLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isLoadingAuth]);

    const handleUnlock = async (frameToUnlock) => {
        if (frameToUnlock.point > user.totalPoint) {
            setSnackbarMessage('Điểm không đủ để mở khóa.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            // Gọi API mở khóa
            const response = await postApiNoneToken('avatar-frame-user/add', {
                userId: user.id,
                avatarFrameId: frameToUnlock.id,
                isActive: false, // Khi mở khóa, mặc định không active
            });

            if (response.status === 200 || response.status === 201) {
                const updatedPoint = user.totalPoint - frameToUnlock.point;

                await putApiNoneToken(`user/update/${auth.user.id}`, {
                    totalPoint: updatedPoint,
                });

                const updatedFrames = frames.map((frame) =>
                    frame.id === frameToUnlock.id ? { ...frame, isBlock: false } : frame,
                );

                setAuth((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        totalPoint: updatedPoint,
                    },
                }));
                setFrames(updatedFrames);

                // Hiển thị thông báo
                setSnackbarMessage('Mở khóa thành công!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error unlocking frame:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi mở khóa. Vui lòng thử lại.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleUse = async (frameToUse) => {
        try {
            const response = await putApiNoneToken('avatar-frame-user/update-is-active-true', {
                userId: user.id,
                avatarFrameId: frameToUse.id,
            });

            if (response.status === 200) {
                setAuth((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        frame: frameToUse,
                    },
                }));

                // Hiển thị thông báo thành công
                setSnackbarMessage('Avatar đã được kích hoạt thành công!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Lỗi khi kích hoạt avatar frame:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi kích hoạt avatar. Vui lòng thử lại.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    if (error) {
        return <div className="w-[100vw] h-[100vh] bg-white text-black">{error}</div>;
    }

    return (
        <Box
            className="flex flex-col items-center bg-amber-50"
            sx={{
                minHeight: '100vh', // Đảm bảo nền phủ toàn màn hình
                color: 'black', // Thay đổi màu chữ để phù hợp
            }}
        >
            <Header />
            <Navbar />

            {loading ? (
                <div className="w-full flex-1 flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            height: '50px',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {/* Ảnh bên trái */}
                        <img
                            src="/img/bg_left.png"
                            alt="Background left"
                            style={{
                                position: 'absolute',
                                top: '250%',
                                left: '0',
                                transform: 'translateY(-50%)', // Canh giữa theo chiều dọc
                                height: '250px', // Kích thước tùy chỉnh
                            }}
                        />
                        {/* Ảnh bên phải */}
                        <img
                            src="/img/bg_right.png"
                            alt="Background right"
                            style={{
                                position: 'absolute',
                                top: '250%',
                                right: '0',
                                transform: 'translateY(-50%)', // Canh giữa theo chiều dọc
                                height: '250px', // Kích thước tùy chỉnh
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 4,
                            minHeight: '755px',
                            maxWidth: '1200px',
                            width: '100%',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '20px',
                            zIndex: 1,
                        }}
                    >
                        <div className="flex flex-col px-4 py-14 items-center border-r-4">
                            {/* Phần bên trái */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 170,
                                    height: 170,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Avatar Frame */}
                                {user.frame && (
                                    <img
                                        src={user.frame.url}
                                        alt="Avatar frame"
                                        style={{
                                            position: 'absolute',
                                            width: '100%', // Đảm bảo khung avatar fit với Box
                                            height: '100%',
                                            zIndex: 2,
                                            pointerEvents: 'none',
                                        }}
                                    />
                                )}

                                {/* Avatar */}
                                <Avatar
                                    src={user.avatar}
                                    alt="User avatar"
                                    sx={{
                                        position: 'absolute',
                                        width: 110,
                                        height: 110,
                                        zIndex: 1,
                                    }}
                                />
                            </Box>
                            {/* Tên người dùng */}
                            <Typography variant="h6">{user.fullName}</Typography>

                            {/* Điểm */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <img
                                    src="/iframe/img/star.png"
                                    alt="Điểm Icon"
                                    style={{ width: 30, height: 30 }} // Giảm kích thước icon sao
                                />
                                <Typography variant="body1">{user.totalPoint || 0}</Typography>
                            </Box>
                        </div>

                        {/* Phần bên phải */}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="h4"
                                sx={{ textAlign: 'center' }}
                            >
                                Gian hàng đổi thưởng
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                            >
                                {frames.map((frame) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        key={frame.id}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: 200,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            }}
                                        >
                                            <img
                                                src={frame.url}
                                                alt={`Frame ${frame.id}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '50%',
                                                    zIndex: 2,
                                                }}
                                            />
                                            <Box sx={{ marginTop: 'auto', textAlign: 'center' }}>
                                                {!frame.isBlock ? (
                                                    frame.id === user.frame?.id ? (
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            Đang sử dụng
                                                        </Typography>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleUse(frame)}
                                                            sx={{
                                                                position: 'absolute', // Đặt nút nằm trên ảnh
                                                                bottom: '5%', // Đặt cách đáy của Box 10%
                                                                left: '32%',
                                                                zIndex: 3, // Nút nằm trên cả avatar
                                                            }}
                                                        >
                                                            Sử dụng
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Box>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => handleUnlock(frame)}
                                                            sx={{
                                                                position: 'absolute', // Đặt nút nằm trên ảnh
                                                                bottom: '5%', // Đặt cách đáy của Box 10%
                                                                left: '32%',
                                                                zIndex: 3, // Nút nằm trên cả avatar
                                                            }}
                                                        >
                                                            Mở khóa
                                                        </Button>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                marginTop: 1,
                                                            }}
                                                        >
                                                            <img
                                                                src="/iframe/img/star.png"
                                                                alt="Điểm Icon"
                                                                style={{
                                                                    width: 30,
                                                                    height: 30,
                                                                }}
                                                            />
                                                            <Typography variant="body1">
                                                                {frame.point}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                                <Snackbar
                                    open={snackbarOpen}
                                    autoHideDuration={3000} // Đóng sau 3 giây
                                    onClose={handleSnackbarClose}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Vị trí hiển thị
                                >
                                    <Alert
                                        onClose={handleSnackbarClose}
                                        severity={snackbarSeverity}
                                        sx={{ width: '100%' }}
                                    >
                                        {snackbarMessage}
                                    </Alert>
                                </Snackbar>
                            </Grid>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default DoiThuong;
