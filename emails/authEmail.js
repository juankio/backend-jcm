import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendEmailVerification({ name, email, token }) {
    const msg = {
      to: email,
      from: 'JCMFotosyVideos<jcmfotosyvideos2012@gmail.com>',
      subject: 'JCM Fotos y Videos - Confirma tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://res.cloudinary.com/ds44ivjww/image/upload/v1723923464/logo_lndo0m.jpg" alt="JCM Fotos y Videos" style="width: 150px; margin-bottom: 20px;" />
            <h1 style="font-size: 24px; color: #333;">Confirma tu cuenta</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hola <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #555;">
              Gracias por registrarte en JCM Fotos y Videos. Para completar el proceso de registro, por favor confirma tu cuenta haciendo clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}" style="background-color: #007BFF; color: white; padding: 15px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Confirmar Cuenta
              </a>
            </div>
            <p style="font-size: 14px; color: #999;">Si no creaste esta cuenta, simplemente puedes ignorar este correo.</p>
          </div>
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dcdcdc;">
            <p style="font-size: 12px; color: #999;">JCM Fotos y Videos &copy; 2024</p>
          </div>
        </div>
      `
    };
  
    try {
      await sgMail.send(msg);
      console.log('Email de verificación enviado correctamente');
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  }
  

  export async function sendEmailResetPassword({ name, email, token }) {
    const msg = {
      to: email,
      from: 'JCMFotosyVideos<jcmfotosyvideos2012@gmail.com>',
      subject: 'JCM Fotos y Videos - Reestablece tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px;">
            <img src="https://res.cloudinary.com/ds44ivjww/image/upload/v1723923464/logo_lndo0m.jpg" alt="JCM Fotos y Videos" style="width: 150px; margin-bottom: 20px;" />
            <h1 style="font-size: 24px; color: #333;">Reestablece tu contraseña</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hola <strong>${name}</strong>,</p>
            <p style="font-size: 16px; color: #555;">
              Has solicitado restablecer tu contraseña. Para hacerlo, haz clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}" style="background-color: #007BFF; color: white; padding: 15px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Reestablecer Contraseña
              </a>
            </div>
            <p style="font-size: 14px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          </div>
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dcdcdc;">
            <p style="font-size: 12px; color: #999;">JCM Fotos y Videos &copy; 2024</p>
          </div>
        </div>
      `
    };
  
    try {
      await sgMail.send(msg);
      console.log('Email de restablecimiento enviado correctamente');
    } catch (error) {
      console.error('Error enviando email:', error);
    }
  }
  
