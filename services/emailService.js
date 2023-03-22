const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
  port: "465",
  secure: true,
  host: "smtp.gmail.com",
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Verify your email";
  const html = `
        
        <!DOCTYPE html>
<html>
  <head>
    <style>
      /* Reset default styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* Set background color and font for the email */
      body {
        background-color: #f8f8f8;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        display:flex;
        justify-content:center;
        align-items:center;
      }

      /* Center the card on the page */
      .card-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
      margin:0 auto;
      }

      /* Style the card */
      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 24px;
        max-width: 400px;
        text-align: center;
        margin : 0 auto;
      }

      /* Style the heading */
      .card h1 {
        font-size: 24px;
        margin-bottom: 16px;
      }

      /* Style the paragraphs */
      .card p {
        margin-bottom: 16px;
      }
      
      /* Style the hr */
      .card hr {
        margin: 16px 0;
        border: 1px solid #eee;
      }

      .card h3{
        margin-bottom: 16px;
      }

      /* Style the button */
      .card a {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.2s ease-in-out;
      }

      /* Change button color on hover */
      .card a:hover {
        background-color: #0069d9;
      }
    </style>
  </head>
  <body>
    <div class="card-wrapper">
      <div class="card">
        <h1>Verify your email</h1>
        <h3>Welcome to our community!</h3>
        <p>Thank you for registering with us. To get started, please verify your email address by clicking on the link below:</p>
        <hr/>
        <p>
        <a href="${process.env.CLIENT_URL}/auth/verifyemail/${token}">Verify Email</a>
        </p>
        <i>This link is valid for <b>24hrs</b> </i>
         <p>Once you've verified your email address, you'll have access to all of our features and content.</p>
        <p>We're thrilled to have you as part of our community and look forward to connecting with you soon!</p>
        <p>Sincerely,</p>
        <p>The Team at FileDesk</p>
      </div>
    </div>
  </body>
</html>

    `;
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset your password";
  const html = `
         <!DOCTYPE html>
<html>
  <head>
    <style>
      /* Reset default styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* Set background color and font for the email */
      body {
        background-color: #f8f8f8;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        display:flex;
        justify-content:center;
        align-items:center;
      }

      /* Center the card on the page */
      .card-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
      margin:0 auto;
      }

      /* Style the card */
      .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 24px;
        max-width: 400px;
        text-align: center;
        margin : 0 auto;
      }

      /* Style the heading */
      .card h1 {
        font-size: 24px;
        margin-bottom: 16px;
      }

      /* Style the paragraphs */
      .card p {
        margin-bottom: 16px;
      }
      
      /* Style the hr */
      .card hr {
        margin: 16px 0;
        border: 1px solid #eee;
      }

      .card h3{
        margin-bottom: 16px;
      }

      /* Style the button */
      .card a {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.2s ease-in-out;
      }

      /* Change button color on hover */
      .card a:hover {
        background-color: #0069d9;
      }
    </style>
  </head>
  <body>
    <div class="card-wrapper">
      <div class="card">
        <h1>Reset your password</h1>
        <p>Thank you for being a part of <b>FileDesk</b>.You can reset your password by clicking on the link below:</p>
        <hr/>
        <p>
        <a href="${process.env.CLIENT_URL}/auth/resetpassword/${token}">Reset Password</a>
        </p>
        <i>This link is valid for <b>24hrs</b> </i>
         <p>Once you've reset your password, you can login to your account easily.</p>
        <p>We're thrilled to have you as part of our community</p>
        <p>Sincerely,</p>
        <p>The Team at FileDesk</p>
      </div>
    </div>
  </body>
</html>
    `;
   await sendEmail(to, subject, html);
  
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
