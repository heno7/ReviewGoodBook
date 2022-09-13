const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail(emailAddress, verifyCode) {
  const msg = {
    to: `${emailAddress}`,
    from: process.env.ADMIN_EMAIL, // Use the email address or domain you verified above
    template_id: "d-6854d6b29b7749b49d92842fcb29f39d",
    dynamic_template_data: {
      verifyCode: String(verifyCode),
    },
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    next(error);
    // console.error(error);

    // if (error.response) {
    //   console.error(error.response.body);
    // }
  }
};
