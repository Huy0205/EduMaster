# Sử dụng Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy mã nguồn của bạn vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build 

# Chạy ứng dụng Next.js
CMD ["node", "build/index.js"]

# Mở cổng 3000 cho ứng dụng (cổng mặc định của Next.js)
EXPOSE 8080
