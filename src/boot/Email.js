const path = require('path')
const nodemailer = require('nodemailer')
const fs = require('fs')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'tucorreo@gmail.com',
		pass: 'tucontraseña',
	},
})

function sendEmail({ to, cc, subject, text, attachmentName }) {
	const attachmentPath = path.join(__dirname, 'files', attachmentName) // Ajusta 'files' según tu estructura de directorios

	const mailOptions = {
		from: 'tucorreo@gmail.com',
		to: Array.isArray(to) ? to.join(', ') : to,
		cc: Array.isArray(cc) ? cc.join(', ') : cc,
		subject,
		text,
		attachments: [
			{
				filename: attachmentName,
				content: fs.createReadStream(attachmentPath),
			},
		],
	}

	return transporter.sendMail(mailOptions)
}

export default ({ Vue }) => {
	Vue.prototype.$sendEmail = sendEmail
}
