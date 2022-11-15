import nodemailer from 'nodemailer';

const emailOlvidePasword = async (datos) => {

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      secure:false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
      });

    const {email,nombre,token} = datos;
    
    const info = await transporter.sendMail({
        from: "APV: Administrador de pacientes de veterinaria",
        to: email,
        subject: "Restablecer Contraseña",
        text: "Restablecer Contraseña",
        html: ` <p>Hola ${nombre}, has solicitado restablecer tu contraseña.</p>
            <P>Sigue el siguiente enlace para para generar una nueva contraseña: 
            <a href="https://friendly-cascaron-ee290e.netlify.app/olvide-password/${token}">Restablecer contraseña</a>
            </P>

            <p>Si tu no solicitaste restablecer contraseña puedes ignorar este mensaje</p>
        
        `
    });

    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailOlvidePasword