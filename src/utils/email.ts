import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  host: "bh8930.banahosting.com",
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@abacoarquitectos.com.ar', // generated ethereal user
    pass: 'y[7gj_Nh]7l5', // generated ethereal password
  },
});

transporter.verify().then(()=> {
  console.log('Conexion lista');
})