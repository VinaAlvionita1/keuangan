module.exports = {
  apps: [
    {
      name: "keuangan-lab",
      script: "./build/index.js",
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};

