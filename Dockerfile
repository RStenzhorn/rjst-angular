FROM nginx:latest

COPY /dist/<NAME> /usr/share/nginx/html

EXPOSE 80
