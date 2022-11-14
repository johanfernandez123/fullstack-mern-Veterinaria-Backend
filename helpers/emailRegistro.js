import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

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
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: ` <p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
            <P>tu cuenta ya esta lista solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
            </P>

            <p>Si tu no creaste tu cuenta, puedes ignorar este mensaje</p>
        
        `
    });

    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailRegistro