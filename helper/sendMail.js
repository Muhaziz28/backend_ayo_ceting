import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'muhammadhaikalaziz28@gmail.com',
        pass: 'pflryczbngqlhjtw'
    }
})

const sendMail = (email, activationLink) => {
    const mailOptions = {
        from: 'muhammadhaikalaziz28@gmail.com',
        to: email,
        subject: 'Account Activation',
        html: `Click link below to activate your account\n${activationLink}`
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

export default sendMail