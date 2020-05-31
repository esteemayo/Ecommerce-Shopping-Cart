const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const ejs = require('ejs');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `John Doe ${process.env.EMAIL_FROM}`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // SENDGRID
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        // MAILTRAP
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // SEND THE ACTUAL EMAIL
    async send(template, subject) {
        // RENDER HTML BASED ON EJS TEMPLATE
        const html = ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // DEFINE EMAIL OPTIONS
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        // CREATE A TRANSPORT AND SEND EMAIL
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to ecommerce shopping cart');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
}