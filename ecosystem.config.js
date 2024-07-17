module.exports = {
    apps: [{
      name: "bbt-backend",
      script: "./bin/www",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        FRONTEND_URL: "http://localhost:5173"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        FRONTEND_URL: "http://ec2-54-255-232-252.ap-southeast-1.compute.amazonaws.com"
      }
    }]
  }