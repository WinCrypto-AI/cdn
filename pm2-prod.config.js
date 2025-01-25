module.exports = {
  apps: [
    {
      name: 'cdn.wincrypto.ai',
      script: './dist/main.js',
      instances: '1', // "2" "max"
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      out_file: './../logs/back-end/cdn.wincrypto.ai/access.log',
      error_file: './../logs/back-end/cdn.wincrypto.ai/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      env: {
        TZ: 'UTC',
        PORT: 5009,
      },
    },
  ],
};
