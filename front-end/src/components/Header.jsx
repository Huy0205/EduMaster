'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '~/context/AuthContext'

const Header = () => {
  const { loggedIn, setLoggedIn } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const avatarRef = useRef(null)
  const handleLoginClick = () => {
    router.push('/login')
  }
  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen); 
  };
  const handleLogout = () => {
    setLoggedIn(false)
    setIsDropdownOpen(false)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click bên ngoài dropdown và ảnh đại diện thì đóng dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <header className="bg-gray-800 flex justify-between items-center py-4 px-6">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="bg-blue-500 text-white p-2 rounded-full">
          <button
            className="font-bold text-xl"
            onClick={() => router.push('/')}
          >
            EduMaster
          </button>
        </div>
      </div>

      {/* Right Side: Conditional Rendering */}
      <div className="flex items-center space-x-4">
        {loggedIn ? (
          <>
            <image
              ref={avatarRef}
              src="https://via.placeholder.com/30"
              alt="User"
              className="w-8 h-8 rounded-full cursor-pointer z-20 relative"
              onClick={handleAvatarClick}
            />
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-[#0D1136] shadow-lg rounded-lg p-4 text-white z-10"
                style={{ top: '6%' }}
              >
                <ul className="mt-2 space-y-2">
                  <li className="cursor-pointer"><a href='profile'>Thông tin cá nhân</a></li>
                  <li
                    className="cursor-pointer text-red-500"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={handleLoginClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              Đăng nhập
            </button>
            {/* {console.log(loggedIn)} */}
          </>
        )}
      </div>
    </header>
  )
}

export default Header
