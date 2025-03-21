'use client';
import { useEffect, useState } from 'react';
import { MailOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import { UserService } from '~/services';
import { CircularProgress } from '@mui/material';

interface ErrorState {
    email: string;
    password: string;
}

function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('tanhuy.se@gmail.com');
    const [password, setPassword] = useState<string>('Admin123');
    const [remember, setRemember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorState>({
        email: '',
        password: '',
    });

    const router = useRouter();

    const validateEmail = (email: string) => {
        if (!email) {
            setError((prev) => ({ ...prev, email: 'Vui lòng nhập email' }));
        } else {
            const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!regex.test(email)) {
                setError((prev) => ({ ...prev, email: 'Email không hợp lệ' }));
            } else {
                setError((prev) => ({ ...prev, email: '' }));
            }
        }
    };

    const validatePassword = (password: string) => {
        if (!password) {
            setError((prev) => ({ ...prev, password: 'Vui lòng nhập mật khẩu' }));
        } else {
            const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // 6-20 characters, at least one digit, one lowercase and one uppercase letter
            if (!regex.test(password)) {
                setError((prev) => ({ ...prev, password: 'Mật khẩu không hợp lệ' }));
            } else {
                setError((prev) => ({ ...prev, password: '' }));
            }
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        if (error.email || error.password) {
            return;
        }
        const result = await UserService.login(email, password);
        const { data, message } = result.data;
        if (data) {
            if (data.user.role === 0) {
                sessionStorage.setItem('admin_access_token', data.token);
                if (remember) {
                    localStorage.setItem('admin-account', JSON.stringify({ email, password }));
                } else {
                    localStorage.removeItem('admin-account');
                }
                router.push('/admin/dashboard');
            } else {
                setError((prev) => ({ ...prev, email: 'Email không phải là tài khoản quản trị' }));
            }
        } else {
            if (message === 'Email is not exist') {
                setError((prev) => ({ ...prev, email: 'Email chưa đăng ký tài khoản' }));
            } else if (message === 'Password is incorrect') {
                setError((prev) => ({ ...prev, password: 'Mật khẩu không chính xác' }));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const rememberAccount = localStorage.getItem('admin-account');
            if (rememberAccount) {
                const { email, password } = JSON.parse(rememberAccount);
                setEmail(email);
                setPassword(password);
                setRemember(true);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="h-screen flex justify-center bg-white">
            <div className="h-full w-[400px] py-8 flex items-center">
                <div className="w-full shadow-[0_1px_8px_0_rgba(165,163,174,0.83)] rounded-md p-5">
                    <h4 className="text-lg text-primary font-bold text-center my-4">EduMaster</h4>
                    <h3 className="text-2xl text-primary font-bold text-center">
                        HỆ THỐNG QUẢN TRỊ
                    </h3>
                    <p className="text-base text-center text-gray-500 font-medium mt-2 mb-5">
                        Vui lòng đăng nhập vào tài khoản của bạn !
                    </p>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleLogin}
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-base font-semibold text-zinc-500">
                                Tài Khoản
                            </label>
                            <div className="flex flex-1 border rounded-lg border-zinc-500">
                                <input
                                    type="email"
                                    value={email}
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => {
                                        validateEmail(email);
                                    }}
                                    className="flex-1 rounded-lg py-2 pl-2 text-base text-zinc-500 outline-none"
                                />
                                <span className="flex items-center px-2 text-zinc-500 cursor-pointer">
                                    <MailOutline />
                                </span>
                            </div>
                            <span className="text-red-500 text-sm font-medium italic">
                                {error.email}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-base font-semibold text-zinc-500">
                                Mật khẩu
                            </label>
                            <div className="flex flex-1 border rounded-lg border-zinc-500">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => {
                                        validatePassword(password);
                                    }}
                                    className="flex-1 rounded-lg pl-2 py-2 text-base text-zinc-500 outline-none"
                                />
                                <span
                                    className="flex items-center px-2 text-zinc-500 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </span>
                            </div>
                            <span className="text-red-500 text-sm font-medium italic">
                                {error.password}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="rounded-lg"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                            />
                            <label className="text-sm font-medium text-zinc-500">
                                Ghi nhớ tài khoản
                            </label>
                        </div>
                        <div className="flex flex-1 mb-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-white rounded-lg py-2 hover:bg-red-300"
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;
