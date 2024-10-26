'use client'
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { useAuth } from '~/context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { postApiNoneToken } from '~/api/page'
const LoginPage = () => {
  const { loggedIn,setLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    let data={
      email: email,
      password: password,
    };
    console.log(data);
    try{
      setLoading(true)
      const res = await postApiNoneToken("/user/login",data)
      if(res.data){
        const userId= res.data.data.id
        localStorage.setItem('userId',userId)
        console.log(userId)
        setLoggedIn(true)
        localStorage.setItem('loggedIn', 'true')
        router.push('/')
      }else {
        setError('Tài khoản, mật khẩu không đúng!')
      }
    }catch(error){
      console.log(error);
    }
    setLoading(false)
  }

  const handleGoogleLogin = async (credentialRespone) => {
    setLoggedIn(true)
    // alert(" Đăng nhập thành công ");
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Đăng nhập</h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleLogin}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label
                htmlFor="email-address"
                className="sr-only"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="sr-only"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="text-red-500 text-sm mt-2"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Đăng nhập bằng Google
            </GoogleLogin>
          </div>
          <div className="flex items-center justify-center mt-4">
            <span className="mr-2">Bạn chưa có tài khoản?</span>
            <button
              className="text-cyan-400"
              onClick={() => {
                router.push('/register')
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
