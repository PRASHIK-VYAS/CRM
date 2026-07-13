import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(to, otp) {
    await transporter.sendMail({
        from : `"CRM" <${process.env.SMTP_USER}>`,
        to,
        subject: `your OTP for password Reset`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>
                <p> IT expires in 5 Minutes.</p>`

    });
    
}

