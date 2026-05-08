import nodemailer from 'nodemailer';
import fs from 'fs';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || 'admin@ventomarket.store';
const SMTP_FROM = process.env.SMTP_FROM || 'admin@ventomarket.store';

function getSmtpPassword() {
  if (process.env.SMTP_PASS) {
    return process.env.SMTP_PASS;
  }
  
  try {
    const secretPath = '/run/secrets/smtp_password.txt';
    if (fs.existsSync(secretPath)) {
      return fs.readFileSync(secretPath, 'utf8').trim();
    }
  } catch (error) {
    console.error('Error leyendo secret de SMTP:', error.message);
  }
  
  return null;
}

const SMTP_PASS = getSmtpPassword();

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

/**
 * Envía un email de recuperación de contraseña
 * @param {string} to - Email del destinatario
 * @param {string} token - Token temporal de recuperación
 */
export async function sendPasswordResetEmail(to, token) {
  if (!SMTP_PASS) {
    throw new Error('SMTP_PASS no está configurado');
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'https://ventomarket.store'}/reset-password?token=${token}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px; }
        .button { display: inline-block; background-color: #4F46E5; color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        a.button, a.button:visited, a.button:hover, a.button:active { color: #ffffff !important; text-decoration: none !important; }
        .button:hover { background-color: #4338ca; }
        .token-box { background-color: #fff; border: 1px solid #e5e7eb; padding: 15px; margin: 20px 0; border-radius: 8px; word-break: break-all; font-size: 12px; color: #6b7280; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .warning { color: #dc2626; font-weight: bold; }
        .text-center { text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vento Market</h1>
        </div>
        <div class="content">
          <h2>Recuperación de contraseña</h2>
          <p>Hola,</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          
          <div class="text-center">
            <a href="${resetUrl}" class="button" style="display:inline-block;background-color:#4F46E5;color:#ffffff !important;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold;margin:20px 0;-webkit-text-fill-color:#ffffff;">Restablecer contraseña</a>
          </div>
          
          <p class="warning">Este enlace expirará en 30 minutos.</p>
          
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <div class="token-box">
            ${resetUrl}
          </div>
          
          <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
          
          <p>Saludos,<br>El equipo de Vento Market</p>
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          <p>&copy; 2026 Vento Market. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Vento Market" <${SMTP_FROM}>`,
    to,
    subject: 'Recuperación de contraseña - Vento Market',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email enviado: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error(`Error al enviar el email: ${error.message}`);
  }
}

export default { sendPasswordResetEmail };
