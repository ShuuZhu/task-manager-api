const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'arbugi29144146@hotmail.com',
    subject: 'Thanks for joining in!',
    text: `Hi ${name}, fuck you bro~`
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'arbugi29144146@hotmail.com',
    subject: 'Thank you for using it',
    text: `Hey ${name}, we will meet again!`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}

