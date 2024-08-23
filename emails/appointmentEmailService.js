import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export async function sendEmailNewAppointment({ date, time, userEmail, userName, adminName }) {
    const emails = [
        { email: userEmail, name: userName },
        { email: 'jcmfotosyvideos2012@gmail.com', name: adminName }
    ];

    for (const recipient of emails) {
        const msg = {
          to: recipient.email,
          from: 'JCMFotosyVideos<jcmfotosyvideos2012@gmail.com>',
          subject: 'JCM Fotos y Videos - Nueva Cita',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;">
              <div style="text-align: center; padding-bottom: 20px;">
                <img src="https://res.cloudinary.com/ds44ivjww/image/upload/v1723923464/logo_lndo0m.jpg" alt="JCM Fotos y Videos" style="width: 150px; margin-bottom: 20px;" />
                <h1 style="font-size: 24px; color: #333;">Nueva Cita Agendada</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                <p style="font-size: 16px; color: #333;">Hola ${recipient.name},</p>
                <p style="font-size: 16px; color: #555;">
                  Tienes una nueva cita programada para el día <strong>${date}</strong> a las <strong>${time}</strong> horas.
                </p>
              </div>
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dcdcdc;">
                <p style="font-size: 12px; color: #999;">JCM Fotos y Videos &copy; 2024</p>
              </div>
            </div>
          `
        };

        try {
          await sgMail.send(msg);
          console.log(`Email de nueva cita enviado correctamente a ${recipient.name}`);
        } catch (error) {
          console.error(`Error enviando email a ${recipient.name}:`, error);
        }
    }
}

export async function sendEmailUpdateAppointment({ date, time, userEmail, userName, adminName }) {
    const emails = [
        { email: userEmail, name: userName },
        { email: 'jcmfotosyvideos2012@gmail.com', name: adminName }
    ];

    for (const recipient of emails) {
        const msg = {
          to: recipient.email,
          from: 'JCMFotosyVideos<jcmfotosyvideos2012@gmail.com>',
          subject: 'JCM Fotos y Videos - Cita Actualizada',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;">
              <div style="text-align: center; padding-bottom: 20px;">
                <img src="https://res.cloudinary.com/ds44ivjww/image/upload/v1723923464/logo_lndo0m.jpg" alt="JCM Fotos y Videos" style="width: 150px; margin-bottom: 20px;" />
                <h1 style="font-size: 24px; color: #333;">Cita Actualizada</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                <p style="font-size: 16px; color: #333;">Hola ${recipient.name},</p>
                <p style="font-size: 16px; color: #555;">
                  La cita ha sido actualizada para el día <strong>${date}</strong> a las <strong>${time}</strong> horas.
                </p>
              </div>
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dcdcdc;">
                <p style="font-size: 12px; color: #999;">JCM Fotos y Videos &copy; 2024</p>
              </div>
            </div>
          `
        };

        try {
          await sgMail.send(msg);
          console.log(`Email de actualización de cita enviado correctamente a ${recipient.name}`);
        } catch (error) {
          console.error(`Error enviando email a ${recipient.name}:`, error);
        }
    }
}

export async function sendEmailCancelAppointment({ date, time, userEmail, userName, adminName }) {
    const emails = [
        { email: userEmail, name: userName },
        { email: 'jcmfotosyvideos2012@gmail.com', name: adminName }
    ];

    for (const recipient of emails) {
        const msg = {
          to: recipient.email,
          from: 'JCMFotosyVideos<jcmfotosyvideos2012@gmail.com>',
          subject: 'JCM Fotos y Videos - Cita Cancelada',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dcdcdc; border-radius: 10px;">
              <div style="text-align: center; padding-bottom: 20px;">
                <img src="https://res.cloudinary.com/ds44ivjww/image/upload/v1723923464/logo_lndo0m.jpg" alt="JCM Fotos y Videos" style="width: 150px; margin-bottom: 20px;" />
                <h1 style="font-size: 24px; color: #333;">Cita Cancelada</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                <p style="font-size: 16px; color: #333;">Hola ${recipient.name},</p>
                <p style="font-size: 16px; color: #555;">
                  La cita programada para el día <strong>${date}</strong> a las <strong>${time}</strong> ha sido cancelada.
                </p>
              </div>
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #dcdcdc;">
                <p style="font-size: 12px; color: #999;">JCM Fotos y Videos &copy; 2024</p>
              </div>
            </div>
          `
        };

        try {
          await sgMail.send(msg);
          console.log(`Email de cancelación de cita enviado correctamente a ${recipient.name}`);
        } catch (error) {
          console.error(`Error enviando email a ${recipient.name}:`, error);
        }
    }
}
