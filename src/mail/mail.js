const mailer = require('nodemailer')
const dotenv = require('dotenv')
const welcome = require('./welcome_template')
const goodbye = require('./goodbye_template')

dotenv.config()

const getEmailData = (to, name, template) => {
  let data = null
  switch (template) {
    case 'welcome':
      data = {
        from: 'eulerlab7@gmail.com',
        to,
        subject: `Welcome ${name}`,
        html: welcome()
      }
      break
    case 'goodbye':
      data = {
        from: 'eulerlab7@gmail.com',
        to,
        subject: `GoodBye ${name}`,
        html: goodbye()
      }
      break
    default:
      data
  }
  return data
}

const sendMail = (to, name, type) => {
  const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'eulerlab7@gmail.com',
      pass: process.env.GOOGLE_EMAIL_PASSWORD
    }
  })
      
  const mail = getEmailData(to, name, type)
  transporter.sendMail(mail, (error, response) => {
    if (error) console.log(error)
    else console.log('email sent successfully')
    transporter.close()
  })
}

module.exports = sendMail
