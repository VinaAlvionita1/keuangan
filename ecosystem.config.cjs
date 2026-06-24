module.exports = {
  apps: [
    {
      name: "keuangan-lab",
      script: "./build/index.js",
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        BODY_SIZE_LIMIT: '10M',
        ORIGIN: 'https://administrasi.labinf.unira.ac.id',
        PROTOCOL_HEADER: 'x-forwarded-proto',
        HOST_HEADER: 'x-forwarded-host',
        PORT_HEADER: 'x-forwarded-port'
      }
    }
  ]
};

