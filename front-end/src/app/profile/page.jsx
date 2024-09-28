'use client'
import React, { useState, useRef } from "react";
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaSchool } from "react-icons/fa";
import Header from '../../components/Header';
const ProfilePage = () => {
  const [avatar, setAvatar] = useState("https://via.placeholder.com/30");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      console.log("File input clicked");
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setFeedbackMessage("Đã thay đổi ảnh đại diện");
        setTimeout(() => setFeedbackMessage(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return input;
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      setFeedbackMessage("Email sai định dạng");
      return;
    }
    setIsEditing(false);
    setFeedbackMessage("Thông tin đã được thay đổi!");
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  return (
      <div className="bg-gray-50 min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 ">
        <Header />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl transition-all duration-300 hover:shadow-lg ">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="relative h-48 w-full md:w-48">
              <img
                className="h-48 w-full object-cover md:w-48 cursor-pointer transition-opacity duration-300 hover:opacity-80"
                src={avatar}
                alt="User avatar"
                onClick={handleAvatarClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <div className="text-center mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  type="button"
                  onClick={handleAvatarClick}  
                >
                  Đổi ảnh đại diện
                </button>
              </div>
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">Thông tin người dùng</div>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  <FaUser className="inline mr-2" /> Tên
                </label>
                <input
                  type="text"
                  id="name"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!isEditing}
                  aria-label="Name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  <FaEnvelope className="inline mr-2" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                  aria-label="Email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                  <FaPhone className="inline mr-2" /> Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  readOnly={!isEditing}
                  aria-label="Phone"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="grade" className="block text-gray-700 text-sm font-bold mb-2">
                  <FaGraduationCap className="inline mr-2" /> Lớp
                </label>
                <select
                  id="grade"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  disabled={!isEditing}
                  aria-label="Grade"
                >
                  <option value="">Chọn Lớp</option>
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      Lớp {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="school" className="block text-gray-700 text-sm font-bold mb-2">
                  <FaSchool className="inline mr-2" /> Trường
                </label>
                <input
                  type="text"
                  id="school"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  readOnly={!isEditing}
                  aria-label="School"
                />
              </div>
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    type="button"
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </form>
            {feedbackMessage && (
              <div className="mt-4 p-2 bg-blue-100 text-red-700 rounded">
                {feedbackMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;