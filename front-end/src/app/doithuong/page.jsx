'use client';
import { useState, useEffect } from 'react';
import { Box, Avatar, Button, Typography } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import { Snackbar, Alert } from '@mui/material';
import { getApiNoneToken, putApiNoneToken, postApiNoneToken } from '~/api/page';
import { useAuth } from '~/context/AuthContext';
import Loading from '../admin/components/loading';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DoiThuong = () => {
    const router = useRouter();

    const { auth, setAuth, isLoadingAuth } = useAuth();
    const { user } = auth;

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
        <Box className="w-screen h-screen flex flex-col text-black bg-amber-50">
            <Header />
            <Navbar />

            {loading ? (
                <div className="w-full flex-1 flex justify-center items-center">
                    <Loading />
                </div>
            ) : (
                <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden">
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            top: 0,
                            bottom: 0,
                            zIndex: 1,
                        }}
                    >
                        <div className="w-full flex justify-between">
                            <Image
                                src="/img/bg_left.png"
                                alt="Background left"
                                width={350}
                                height={100}
                            />
                            <Image
                                src="/img/bg_right.png"
                                alt="Background right"
                                width={350}
                                height={100}
                            />
                        </div>
                        <div className="w-full flex justify-between">
                            <Image
                                src="/img/bg_right.png"
                                alt="Background right"
                                width={350}
                                height={100}
                            />
                            <Image
                                src="/img/bg_left.png"
                                alt="Background left"
                                width={350}
                                height={100}
                            />
                        </div>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '80%',
                            height: '80%',
                            background: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            paddingRight: 0,
                            zIndex: 1,
                        }}
                    >
                        <div className="px-10 flex flex-col justify-center items-center border-r-4">
                            {/* Phần bên trái */}
                            {user && (
                                <>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 170,
                                            height: 170,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Avatar Frame */}
                                        {user?.frame && (
                                            <Image
                                                src={user.frame.url}
                                                alt="Avatar frame"
                                                width={170}
                                                height={170}
                                                unoptimized
                                                style={{
                                                    position: 'absolute',
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
                                                width: 150,
                                                height: 150,
                                                zIndex: 1,
                                            }}
                                        />
                                    </Box>
                                    {/* Tên người dùng */}
                                    <Typography variant="h6">{user.fullName}</Typography>
                                    {/* Điểm */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mt: 1,
                                        }}
                                    >
                                        <Image
                                            src="/iframe/img/star.png"
                                            alt="Điểm Icon"
                                            width={30}
                                            height={30}
                                        />
                                        <Typography variant="body1">
                                            {user.totalPoint || 0}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </div>

                        {/* Phần bên phải */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                overflowY: 'auto',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 10,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    padding: 2,
                                }}
                            >
                                <Typography variant="h4">Gian hàng đổi thưởng</Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(4, 1fr)',
                                    },
                                    gap: 2,
                                    padding: 2,
                                }}
                            >
                                {frames.map((frame) => (
                                    <Box
                                        key={frame.id}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                            position: 'relative',
                                        }}
                                    >
                                        <Image
                                            src={frame.url}
                                            alt={`Frame ${frame.id}`}
                                            width={200}
                                            height={200}
                                            objectFit="contain"
                                            unoptimized
                                            style={{ zIndex: 2 }}
                                        />
                                        <Box sx={{ marginTop: 'auto', textAlign: 'center' }}>
                                            {!frame.isBlock ? (
                                                frame.id === user?.frame?.id ? (
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
                                                        sx={{ zIndex: 3 }}
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
                                                        sx={{ zIndex: 3 }}
                                                    >
                                                        <Image
                                                            src="/iframe/img/star.png"
                                                            alt="Điểm Icon"
                                                            width={30}
                                                            height={30}
                                                        />
                                                        <Typography variant="body1">
                                                            {frame.point}
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={3000}
                                onClose={handleSnackbarClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >
                                <Alert
                                    onClose={handleSnackbarClose}
                                    severity={snackbarSeverity}
                                    sx={{ width: '100%' }}
                                >
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Box>
                </div>
            )}
        </Box>
    );
};

export default DoiThuong;
