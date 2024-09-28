'use client';
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import firebase from "../../firebase/setup";
import { useRouter } from 'next/navigation';
const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    school: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Tên sai";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email sai cấu trúc";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (!/^\+?[0-9]\d{1,9}$/.test(value)) {
          newErrors.phone = "Số điện thoại không đúng";
        } else {
          delete newErrors.phone;
        }
        break;
      case "grade":
        if (!value) {
          newErrors.grade = "Bắt buộc chọn";
        } else {
          delete newErrors.grade;
        }
        break;
      case "school":
        if (!value.trim()) {
          newErrors.school = "Bắt buộc nhập tên trường";
        } else {
          delete newErrors.school;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));
    if (Object.keys(errors).length === 0) {
      console.log("Form submitted:", formData);
      router.push('/login');
    }
    else{
      console.log("Lỗi + ",formData);
    }
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Google sign up clicked");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Tạo tài khoản</h2>

            {["name", "email", "phone", "grade", "school"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === "name" ? "Tên" : field === "email" ? "Email" : field === "phone" ? "Số điện thoại" : field === "grade" ? "Lớp" : "Trường học"}
                </label>
                <div className="mt-1">
                  {field === "grade" ? (
                    <select
                      id={field}
                      name={field}
                      required
                      className={`block w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={formData[field]}
                      onChange={handleChange}
                      aria-invalid={errors[field] ? "true" : "false"}
                      aria-describedby={errors[field] ? `${field}-error` : undefined}
                    >
                      <option value="">Chọn lớp</option>
                      {[1, 2, 3, 4, 5].map((grade) => (
                        <option key={grade} value={grade}>Lớp {grade}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      value={formData[field]}
                      onChange={handleChange}
                      aria-invalid={errors[field] ? "true" : "false"}
                      aria-describedby={errors[field] ? `${field}-error` : undefined}
                    />
                  )}
                </div>
                {errors[field] && (
                  <p className="mt-2 text-sm text-red-600" id={`${field}-error`}>
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Đăng ký
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
              <button
                onClick={handleGoogleSignup}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <FcGoogle className="h-5 w-5 mr-2" />
                )}
                Đăng ký với tài khoản Google
              </button>
            </div>
            <div className="flex items-center justify-center mt-4">
              <span className="mr-2">Bạn đã có tài khoản?</span>
              <a href="login" className="text-cyan-400">Đăng nhập</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
