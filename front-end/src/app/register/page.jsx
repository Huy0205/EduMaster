'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postApiNoneToken } from '~/api/page';
import {
    Box,
    Button,
    Typography,
    TextField,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        currentGrade: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };
        switch (name) {
            case 'fullName':
                newErrors.fullName = value.trim() ? '' : 'Tên không được để trống';
                break;
            case 'email':
                newErrors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Email không hợp lệ';
                break;
            case 'phoneNumber':
                newErrors.phoneNumber = /^\+?[0-9]\d{1,9}$/.test(value)
                    ? ''
                    : 'Số điện thoại không hợp lệ';
                break;
            case 'currentGrade':
                newErrors.currentGrade = value ? '' : 'Vui lòng chọn lớp';
                break;
            case 'password':
                newErrors.password = value.trim() ? '' : 'Mật khẩu không được để trống';
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };
    const handleRegister = async () => {
        // Validate dữ liệu
        Object.keys(formData).forEach((key) => validateField(key, formData[key]));
        if (Object.values(errors).some((err) => err)) {
            console.log('Vui lòng sửa lỗi trước khi tiếp tục!', errors);
            return;
        }

        try {
            const res = await postApiNoneToken('user/register', formData);
            if (res.data) {
                console.log('Đăng ký thành công!');
                router.push('/login'); // Chuyển sang trang đăng nhập
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
        }
    };
    const handleOpenOtpDialog = () => {
        setOtpDialogOpen(true);
    };

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            await postApiNoneToken('user/send-otp-by-mail', { email: formData.email });
            setOtpMessage('OTP đã được gửi đến email của bạn!'); // Hiển thị thông báo
            setLoading(false);
        } catch (error) {
            console.log(error);
            setOtpMessage('Gửi OTP thất bại! Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            setOtpMessage('Vui lòng nhập mã OTP!'); // Hiển thị lỗi khi OTP trống
            return;
        }
        try {
            const res = await postApiNoneToken('user/verify-otp', {
                email: formData.email,
                otp,
            });
            console.log(res);
            if (res.data && res.data.message === 'OTP is correct') {
                console.log('OTP xác thực thành công');
                setOtpMessage('Xác thực OTP thành công!'); // Hiển thị thông báo thành công
                await handleRegister(); // Tiến hành đăng ký
            } else {
                setOtpMessage('Xác thực OTP thất bại!'); // Hiển thị lỗi khi OTP không hợp lệ
            }
        } catch (error) {
            console.error('Lỗi xác thực OTP:', error);
            setOtpMessage('Xác thực OTP thất bại! Vui lòng thử lại.');
        }
    };

    const handleSubmit = async () => {
        Object.keys(formData).forEach((key) => validateField(key, formData[key]));
        if (Object.values(errors).some((err) => err)) {
            console.log('Vui lòng sửa lỗi trước khi tiếp tục!');
            return;
        }
        handleOpenOtpDialog(); // Mở dialog nhập OTP
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Form container */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                    py: 8,
                    px: 4,
                }}
            >
                <Box
                    sx={{
                        maxWidth: 500,
                        width: '100%',
                        bgcolor: 'white',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        fontWeight="bold"
                        color="text.primary"
                        mb={2}
                    >
                        Tạo tài khoản
                    </Typography>

                    <form>
                        {['fullName', 'email', 'phoneNumber', 'currentGrade', 'password'].map(
                            (field) => (
                                <Box
                                    key={field}
                                    mb={2}
                                >
                                    {field === 'currentGrade' ? (
                                        <Select
                                            id={field}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            fullWidth
                                            displayEmpty
                                            required
                                        >
                                            <MenuItem value="">
                                                <em>Chọn lớp</em>
                                            </MenuItem>
                                            {[1, 2].map((grade) => (
                                                <MenuItem
                                                    key={grade}
                                                    value={grade}
                                                >
                                                    Lớp {grade}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        <TextField
                                            id={field}
                                            name={field}
                                            type={field === 'password' ? 'password' : 'text'}
                                            label={
                                                field === 'fullName'
                                                    ? 'Tên'
                                                    : field === 'email'
                                                    ? 'Email'
                                                    : field === 'phoneNumber'
                                                    ? 'Số điện thoại'
                                                    : 'Mật khẩu'
                                            }
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={formData[field]}
                                            onChange={handleChange}
                                            error={Boolean(errors[field])}
                                            helperText={errors[field]}
                                        />
                                    )}
                                </Box>
                            ),
                        )}

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ py: 1.5 }}
                        >
                            Đăng ký
                        </Button>
                    </form>

                    {/* Đăng nhập */}
                    <Box
                        mt={4}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="body2">Bạn đã có tài khoản?</Typography>
                        <Button
                            sx={{ ml: 1 }}
                            onClick={() => {
                                router.push('/login');
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* OTP Dialog */}
            <Dialog
                open={otpDialogOpen}
                onClose={() => setOtpDialogOpen(false)}
            >
                <DialogTitle>Xác thực OTP</DialogTitle>
                <DialogContent>
                    <Typography>Email: {formData.email}</Typography>
                    <Button
                        variant="outlined"
                        onClick={handleSendOtp}
                        sx={{ my: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi OTP'}
                    </Button>
                    {otpMessage && (
                        <Typography
                            sx={{
                                color: otpMessage.includes('thành công') ? 'green' : 'red',
                                mt: 1,
                                fontSize: '0.875rem',
                            }}
                        >
                            {otpMessage}
                        </Typography>
                    )}
                    <TextField
                        fullWidth
                        label="Mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        error={!otp.trim() && otpMessage === 'Vui lòng nhập mã OTP!'}
                        helperText={
                            !otp.trim() && otpMessage === 'Vui lòng nhập mã OTP!' ? otpMessage : ''
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOtpDialogOpen(false)}
                        color="secondary"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleVerifyOtp}
                        color="primary"
                    >
                        Xác thực
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RegistrationPage;
