const nodemailer = require('nodemailer');

let transporterPromise;

async function getTransporter() {
  if (process.env.EMAIL_ENABLED === 'false') return null;
  if (!transporterPromise) {
    transporterPromise = (async () => {
      if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
        });
      }
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[email] Ethereal de desenvolvimento: ${testAccount.user}`);
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587, secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    })();
  }
  return transporterPromise;
}

async function sendWelcomeEmail({ to, name }) {
  const transporter = await getTransporter();
  if (!transporter) return { skipped: true };
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'IFScore <no-reply@ifscore.local>',
    to,
    subject: 'Bem-vindo ao IFScore',
    text: `Olá, ${name}!\n\nSeu cadastro no IFScore foi realizado com sucesso.`,
    html: `<h1>Bem-vindo ao IFScore, ${escapeHtml(name)}!</h1><p>Seu cadastro foi realizado com sucesso.</p>`
  });
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log(`[email] Prévia da mensagem: ${previewUrl}`);
  return { messageId: info.messageId, previewUrl };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

module.exports = { sendWelcomeEmail };
