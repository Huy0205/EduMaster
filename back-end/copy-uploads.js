const fs = require('fs');
const path = require('path');

// Đường dẫn gốc và thư mục đích
const source = path.join(__dirname, 'src/uploads');
const destination = path.join(__dirname, 'build/uploads');

// Hàm sao chép thư mục
function copyFolderSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Thực hiện sao chép
try {
  copyFolderSync(source, destination);
  console.log('Thư mục uploads đã được copy thành công.');
} catch (error) {
  console.error('Lỗi khi copy thư mục uploads:', error);
}
