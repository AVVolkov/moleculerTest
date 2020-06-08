"use strict";

const nodemailer = require("nodemailer");

module.exports = {
	name: "mail",
	version: 1,

	settings: {
		$secureSettings: ["transport.auth.user", "transport.auth.pass"],

		from: process.env.EMAIL_FROM || "st3p.volkov@yandex.ru",
		transport: {
			port: process.env.EMAIL_PORT || 465,
			host: process.env.EMAIL_HOST || "smtp.yandex.ru",
			secure: process.env.EMAIL_SECURE || true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		}
	},

	actions: {
		send(ctx) {
			return this.sendMail(ctx.params.to, ctx.params.subject, ctx.params.text);
		}
	},

	methods: {
		sendMail(to, subject, text) {
			const transport = this.prepareTransport();
			return transport.sendMail({
				from: this.settings.from,
				to,
				subject,
				html: text
			});
		},

		prepareTransport() {
			return nodemailer.createTransport({
				host: this.settings.transport.host,
				port: this.settings.transport.port,
				secure: this.settings.transport.secure,
				auth: {
					user: this.settings.transport.auth.user,
					pass: this.settings.transport.auth.pass
				}
			});
		}
	}
};
