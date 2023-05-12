const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // check
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  async sendActivetionMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Активация аккаунта' + process.env.API_URL,
      text: '',
      html: `
      <div>
        <h1>Активация аккаунта</h1>
        <a href='${link}' target='_blank'>${link}</a>
      </div>
      `
    });
  }
}

module.exports = new MailService();
