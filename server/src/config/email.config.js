import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { ENV } from './env.config.js';

//* Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: ENV.BREVO_HOST,
  port: ENV.BREVO_PORT,
  auth: {
    user: ENV.BREVO_USERNAME,
    pass: ENV.BREVO_PASSWORD,
  },
});

//* Configure mailgen with default settings
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: ENV.COMPANY_NAME || 'BiteBox',
    link: ENV.FRONTEND_URL || 'https://bitebox.com/',
    // logo: '../../../client/src/assets/logo.png',
  },
});

//* Function to generate an email with the provided contents
const generateEmail = function (options) {
  const { name, intro, action, outro } = options;

  const emailContent = {
    body: {
      name,
      intro,
      action,
      outro,
    },
  };

  // Generate an HTML email with the provided contents
  const emailBody = mailGenerator.generate(emailContent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailText = mailGenerator.generatePlaintext(emailContent);

  return {
    html: emailBody,
    text: emailText,
  };
};

export { transporter, generateEmail };
