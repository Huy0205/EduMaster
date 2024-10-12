'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
const Navbar = () => {
  const router = useRouter()
  const handleVaoHocClick = () => {
    router.push('/baihoc')
  }
  const handleOnTapClick = () => {
    router.push('/ontap')
  }
  return (
    <nav className="bg-gray-700 border-t-2 border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 py-4">
            <li>
              <div className="px-4 py-2 text-white hover:bg-green-300 font-bold hover:text-white rounded cursor-pointer transition-colors">
                <button onClick={handleVaoHocClick}>Vào học</button>
              </div>
            </li>
            <li>
              <div className="px-4 py-2 text-white hover:bg-green-300 font-bold hover:text-white rounded cursor-pointer transition-colors">
                <button onClick={handleOnTapClick}>Ôn Tập</button>
              </div>
            </li>  
            <li>
              <div className="px-4 py-2 text-white hover:bg-green-300 font-bold hover:text-white rounded cursor-pointer transition-colors">
                <button onClick={handleVaoHocClick}>Kiểm Tra</button>
              </div>
            </li>          
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
