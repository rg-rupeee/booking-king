const axios = require("axios");

const url = "https://api.sendinblue.com/v3/smtp/email";

exports.sendMail = async (to, subject, htmlContent) => {
  try {
    const data = {
      sender: {
        name: "Booking King",
        email: "garhwalrupesh@gmail.com",
      },
      to: [
        {
          email: to.email,
          name: to.name,
        },
      ],
      subject,
      htmlContent,
    };

    const response = await axios.request({
      method: "POST",
      url,
      data,
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
    });

    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
};

exports.sendMailViaTemplate = async (to, templateId) => {
  try {
    const data = {
      to: [
        {
          email: to.email,
          name: to.name,
        },
      ],
      templateId,
    };

    const response = await axios.request({
      method: "POST",
      url,
      data,
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
      },
    });

    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
};
