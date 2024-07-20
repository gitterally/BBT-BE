# Bubble Tea Merchandise Ecommerce System Backend

A full-stack MERN (MongoDB, Express, React, Node.js) ecommerce platform for bubble tea merchandise, featuring a user-friendly shopping experience and an admin portal for order management.

## Live Website

Visit the live website: [BBT Project](http://ec2-54-255-232-252.ap-southeast-1.compute.amazonaws.com)

## Repositories

- Frontend: [https://github.com/bfcxfm/BBT-Merch](https://github.com/bfcxfm/BBT-Merch)
- Backend: [https://github.com/bfcxfm/BBT-BE](https://github.com/bfcxfm/BBT-BE)

## Project Structure

Our project is split into two main repositories:

1. **Frontend (BBT-Merch)**: Contains the React-based user interface, including all client-side logic and components.

2. **Backend (BBT-BE)**: Houses the Express.js server, API endpoints, database interactions, and business logic.

This separation allows for independent development and scaling of the frontend and backend components.

## Deployment

The application is deployed on an AWS EC2 instance with Nginx serving as a reverse proxy. This setup ensures that the backend is not directly exposed to the public internet, enhancing security.

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name xxx.compute.amazonaws.com;

    location / {
        root /home/ec2-user/.../dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

This configuration serves the frontend from the `/dist` directory and proxies API requests to the local backend server running on port 3000.

### Backend Deployment with PM2

To run the backend server using PM2 on port 3000, follow these steps:

1. Navigate to the backend directory:

   ```
   cd BBT-Merch/backend
   ```

2. Install PM2 globally if you haven't already:

   ```
   npm install -g pm2
   ```

3. Start the backend server with PM2:

   ```
   pm2 start app.js --name bbt-backend -- --port 3000
   ```

4. To ensure the backend starts automatically on system reboot:

   ```
   pm2 startup
   pm2 save
   ```

5. To monitor the backend process:

   ```
   pm2 monit
   ```

6. To view logs:

   ```
   pm2 logs bbt-backend
   ```

7. To stop the backend:
   ```
   pm2 stop bbt-backend
   ```
