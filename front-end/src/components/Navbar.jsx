import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 border-t-2 border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 py-4">
          {["Vào học", "Ôn Tập", "Kiểm tra"].map((item, index) => (
            <li key={index}>
              <div className="px-4 py-2 text-white hover:bg-green-300 font-bold hover:text-white rounded cursor-pointer transition-colors">
                {item}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
