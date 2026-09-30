const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT,
    secure : process.env.EMAIL_SECURE === "true",
    auth :{
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }

})

async function verifyEmailService() {
    try {
        await transporter.verify();
        console.log("Email service is ready to send messages");
    } catch (error) {
        console.error("Error with email service:", error);
    }
}

const sendEmail = async(to ,subject, text, html)=>{
    try{
        await transporter.sendMail({
            from :  `"Muzik Team" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            text,
            html
        });
        console.log("Email sent successfully");
    }catch(error){
        console.error("Error sending email: ", error);
    }
}

/**
 * Send registration email to new users
 * @param {string} userEmail - The email address of the user
 * @param {string} name - The name of the user
 */
async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Muzik! Enjoy the beats! 🎉";

  const text = `Hello ${name},

        Thank you for registering at Muzik.
        We're excited to have you on board!

        Best Regards,
        Muzik Team
        `;

  const html = `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f4f4;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
      
      <h2 style="color:#333;">Welcome to Muzik 🚀</h2>
      
      <p>Hello <b>${name}</b>,</p>
      
      <p>
        Thank you for registering with <b>Muzik </b>. 
        We are excited to have you as part of our community.
      </p>
      
      <p>
        You can now start exploring our music library and creating playlists!
      </p>

      <hr>

      <p style="color:gray; font-size:14px;">
        Best Regards,<br>
        <b>The Muzik Team</b>
      </p>

    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail , verifyEmailService };
