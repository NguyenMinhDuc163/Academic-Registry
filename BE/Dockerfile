# Sử dụng Node.js phiên bản 16 (hoặc phiên bản bạn muốn sử dụng)
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 (hoặc cổng mà ứng dụng của bạn sử dụng)
EXPOSE 3000

# Thiết lập biến môi trường để xác định môi trường production
ENV NODE_ENV=production

# Khởi chạy ứng dụng bằng lệnh start
CMD ["npm", "start"]
