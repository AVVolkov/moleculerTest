"use strict";

const ApiGateway = require("moleculer-web");
const IO = require("socket.io");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT || 3001,
		ip: "0.0.0.0",
		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			allowedHeaders: [],
			exposedHeaders: [],
			credentials: false,
			maxAge: 3600
		},

		routes: [
			{
				path: "/api",

				autoAliases: true,
				whitelist: [
					"v1.users.create",
					"v1.users.list",
					"v1.users.addResult",
					"v1.users.addResult",
					"v1.users.listByResult",
					"socket.io"
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],
				mergeParams: true,
				authentication: false,
				authorization: false,

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 *
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all",

				// Enable/disable logging
				logging: true
			}
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,
	},

	actions: {
		emitSocket(ctx) {
			if (!this.io) {
				this.logger.warning("Socket not inited yet.");
				return;
			}

			this.io.emit(ctx.params.event, ctx.params.data);
		}
	},

	methods: {},

	started() {
		this.io = IO.listen(this.server);

		this.io.on("connection", client => {
			this.logger.debug("Client connected via websocket!");

			client.on("disconnect", () => {
				this.logger.debug("Client disconnected");
			});
		});
	}
};
