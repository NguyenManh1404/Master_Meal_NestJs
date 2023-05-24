const globalConfiguration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  uploadFolder: process.env.UPLOAD_FOLDER || './tmp',
  allowMimes: process.env.ALLOW_MIMES ? process.env.ALLOW_MIMES.split(',') : ['image/jpg'],
  database: {
    driver: process.env.DB_DRIVER || 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    db_name: process.env.DB_DATABASE || '127.0.0.1',
    db_user: process.env.DB_USERNAME || 'root',
    db_pass: process.env.DB_PASSWORD || 'root',
    logging: !process.env.DB_LOGGING ? false : console[process.env.DB_LOGGING],
  },
  mail: {
    host: process.env.MAIL_HOST || '127.0.0.1',
    port: parseInt(process.env.MAIL_PORT, 10) || 443,
    secure: process.env.MAIL_SECURE === 'true' || false,
    username: process.env.MAIL_USERNAME || 'mail_username',
    password: process.env.MAIL_PASSWORD || 'mail_password',
    alias: process.env.MAIL_ALIAS || 'no-reply@comtan.com',
  },
});

export default globalConfiguration;
