'use client'
import Link from 'next/link';
import { FaUser, FaBook, FaTasks, FaClipboard } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
function Baihoc() {
const router = useRouter();

  return (
    <div>
     <button
      onClick={() => router.back()}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Go Back
    </button>
    <a>Đây là trang bài học</a>
    </div>
  );
}

export default Baihoc;
