# Sử dụng Node.js làm base image
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Xóa file mặc định của Nginx
RUN rm -rf ./*

# Sao chép build output từ giai đoạn build
COPY --from=build /app/build .

# Sao chép file cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]