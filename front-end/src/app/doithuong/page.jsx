'use client';
import { useState, useEffect } from 'react';
import { Box, Avatar, Button, Typography, Grid } from '@mui/material';
import Navbar from '~/components/Navbar';
import Header from '~/components/Header';
import { Snackbar, Alert } from '@mui/material';
import { getApiNoneToken, putApiNoneToken, postApiNoneToken } from '~/api/page';
import { useAuth } from '~/context/AuthContext';

const UserAvatarPage = () => {
    const [avatar, setAvatar] = useState('');
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [frameUserMapping, setFrameUserMapping] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState();
    const [point, setPoint] = useState();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [activeFrameUrl, setActiveFrameUrl] = useState('');

    const { auth, setAuth } = useAuth();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const activeFrame = frameUserMapping.find((f) => f.isActive);
        const frameUrl = activeFrame
            ? frames.find((frame) => frame.id === activeFrame.avatarFrameId)?.url
            : ''; // URL mặc định nếu không tìm thấy
        setActiveFrameUrl(frameUrl);
    }, [frameUserMapping, frames]);

    useEffect(() => {
        if (!auth.user) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Gọi API lấy thông tin người dùng
                const userResponse = await getApiNoneToken(`user/${auth.user.id}`);
                const userData = userResponse.data.data;
                setAvatar(userData.avatar || '');
                setName(userData.fullName || '');
                setPoint(userData.totalPoint || 0);

                // Gọi API lấy danh sách avatar frames
                const framesResponse = await getApiNoneToken('avatar-frame/list');
                const framesData = framesResponse.data.data;
                setFrames(framesData);

                // Gọi API kiểm tra avatar frame đang sử dụng
                const frameUserResponse = await getApiNoneToken(
                    `avatar-frame-user/user/${auth.user.id}`,
                );
                const frameUserData = frameUserResponse.data.data;
                setFrameUserMapping(frameUserData); // Lưu dữ liệu từ API
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth.user]);

    const handleUnlock = async (id) => {
        // Tìm frame được mở khóa
        const frameToUnlock = frames.find((frame) => frame.id === id);

        // Kiểm tra nếu không đủ điểm
        if (point < frameToUnlock.point) {
            setSnackbarMessage('Điểm không đủ để mở khóa.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            // Gọi API mở khóa
            const response = await postApiNoneToken('avatar-frame-user/add', {
                userId: auth.user.id,
                avatarFrameId: id,
                isActive: false, // Khi mở khóa, mặc định không active
            });

            if (response.status === 200 || response.status === 201) {
                // Trừ điểm
                const updatedPoint = point - frameToUnlock.point;
                setPoint(updatedPoint);

                // Gọi API để cập nhật điểm của user
                await putApiNoneToken(`user/update/${auth.user.id}`, {
                    totalPoint: updatedPoint,
                });

                // Cập nhật danh sách frameUserMapping
                setFrameUserMapping((prevMapping) => [
                    ...prevMapping,
                    { avatarFrameId: id, isActive: false },
                ]);

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

    const handleUse = async (id) => {
        try {
            // Gọi API cập nhật trạng thái active
            const response = await putApiNoneToken('avatar-frame-user/update-is-active-true', {
                userId: auth.user.id,
                avatarFrameId: id,
            });
            console.log(response, 'avatarFrame');

            if (response.status === 200) {
                // Cập nhật frameUserMapping
                setFrameUserMapping((prevMapping) =>
                    prevMapping.map(
                        (mapping) =>
                            mapping.avatarFrameId === id
                                ? { ...mapping, isActive: true } // Đánh dấu frame hiện tại là active
                                : { ...mapping, isActive: false }, // Các frame khác không active
                    ),
                );

                setAuth((prevAuth) => ({ ...prevAuth, avatarFrameId: id }));

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

    if (loading) {
        return <div>Đang tải thông tin người dùng...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
                    maxWidth: '1200px', // Giới hạn chiều rộng toàn khung nội dung
                    width: '100%',
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    zIndex: 1,
                }}
            >
                {/* Phần bên trái */}
                <Box
                    sx={{
                        width: '250px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        borderRight: '1px solid #ddd',
                        paddingRight: 2,
                    }}
                >
                    {activeFrameUrl ? (
                        <img
                            src={activeFrameUrl}
                            alt="Avatar frame"
                            style={{
                                position: 'absolute',
                                width: 180,
                                height: 180,
                                top: '42%',
                                zIndex: 2,
                                pointerEvents: 'none',
                            }}
                        />
                    ) : null}
                    <Avatar
                        src={avatar}
                        alt="User avatar"
                        sx={{ width: 120, height: 120, mb: 2, zIndex: 1 }}
                    />
                    <Typography variant="h6">{name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Hình ảnh thay thế chữ "Điểm" */}
                        <img
                            src="/iframe/img/star.png" // Đường dẫn đến ảnh
                            alt="Điểm Icon"
                            style={{ width: 50, height: 50 }} // Điều chỉnh kích thước ảnh
                        />
                        {/* Hiển thị số điểm */}
                        <Typography variant="body1">{point || 0}</Typography>
                    </Box>
                </Box>

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
                        {frames.map((frame) => {
                            const userFrame = frameUserMapping.find(
                                (f) => f.avatarFrameId === frame.id,
                            );
                            const isActive = userFrame?.isActive || false; // Kiểm tra trạng thái
                            const isOwned = !!userFrame; // Kiểm tra xem frame có trong danh sách user hay không

                            return (
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
                                        <Avatar
                                            src={avatar}
                                            alt="User avatar"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 1,
                                            }}
                                        />
                                        <Box sx={{ marginTop: 'auto', textAlign: 'center' }}>
                                            {isOwned ? (
                                                isActive ? (
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
                                                        onClick={() => handleUse(frame.id)}
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
                                                        onClick={() => handleUnlock(frame.id)}
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
                                                            style={{ width: 30, height: 30 }}
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
                            );
                        })}
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
        </Box>
    );
};

export default UserAvatarPage;
