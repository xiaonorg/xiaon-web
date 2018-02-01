FROM node:8-alpine
MAINTAINER xiaoyun(xiaoyun-studio@foxmail.com)
ENV NODE_ENV=production
ENV HOST 0.0.0.0
EXPOSE 3000
COPY . /app/xiaoyun-web/
WORKDIR /app/xiaoyun-web
# 设置时区
RUN echo "Asia/Shanghai" > /etc/timezone;
# 使用淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org
# 安装依赖
RUN npm install
# 编译源码
RUN npm run build
CMD ["npm", "run","start"]
