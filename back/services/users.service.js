"use strict";

const { MoleculerError } = require("moleculer").Errors;
const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	version: 1,

	/**
	 * Mixins
	 */
	mixins: [DbMixin("users")],

	/**
	 * Settings
	 */
	settings: {
		fields: [
			"_id",
			"name",
			"email",
			"results",
			"minTime"
		],

		entityValidator: {
			name: "string|min:3",
			email: "string",
			results: {
				type: "array",
				optional: true
			},
			minTime: {
				type: "number",
				optional: true
			}
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			create(ctx) {
				if (!ctx.params.results) {
					ctx.params.results = [];
				}
				if (!ctx.params.minTime) {
					ctx.params.minTime = null;
				}
			}
		}
	},

	/**
	 * Actions
	 */
	actions: {
		listByResult: {
			rest: "GET /top",
			params: {
				page: { type: "number", default: 1, convert: true },
				pageSize: { type: "number", default: 10, convert: true },
			},
			async handler(ctx) {
				const query = { minTime: { $ne: null } };
				const rows = await this.adapter.find({
					offset: ctx.params.pageSize * ctx.params.page - ctx.params.pageSize,
					limit: ctx.params.pageSize,
					sort: ["minTime"],
					query
				});
				const count = await this.adapter.count({ query });

				return {
					rows,
					page: ctx.params.page,
					pageSize: ctx.params.pageSize,
					total: count,
					totalPages: Math.ceil(count / ctx.params.pageSize)
				};
			}
		},

		create: {
			rest: "POST /",
			params: {
				name: "string",
				email: "email",
				result: { type: "number", default: null, optional: true }
			},
			async handler(ctx) {
				let doc = await this.adapter.find({
					limit: 1,
					query: { email: ctx.params.email }
				});

				if (doc && doc[0]) {
					throw new MoleculerError("Invalid EMAIL", 409, "CONFLICT");
				}

				doc = await this.adapter.insert({
					name: ctx.params.name,
					email: ctx.params.email,
					results: ctx.params.result ? [ctx.params.result] : [],
					minTime: ctx.params.result || null
				});

				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("created", json, ctx);

				ctx.call("api.emitSocket", { event: "user.create" });
				return json;
			}
		},

		addResult: {
			rest: "PUT /:id/results",
			params: {
				result: "number"
			},
			async handler(ctx) {
				let doc = await this.adapter.findById(ctx.params.id);

				if (doc === null) {
					throw new MoleculerError("Invalid ID", 404, "NOT_FOUND");
				}
				let top = await this.adapter.find({
					limit: 1,
					sort: ["minTime"],
					query: { minTime: { $ne: null } }
				});
				top = top && top.length > 0 ? top[0] : null;

				let minTime = ctx.params.result;
				// TODO: Do refactoring
				doc.results.forEach(item => {
					if (item < minTime) {
						minTime = item;
					}
				});

				doc = await this.adapter.updateById(ctx.params.id, {
					$addToSet: { results: ctx.params.result },
					$set: { minTime }
				});
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				if (top !== null && top.minTime > minTime && top._id.toString() !== doc._id.toString()) {
					try {
						await ctx.call("v1.mail.send", {
							to: top.email,
							subject: "Ваш рекорд побит",
							text: `Ваш рекорд побит ${doc.name} с результатом ${minTime}`,
						});
					} catch (err) {
						this.logger.error("addResult.sendMail", err);
					}
				}

				if (minTime === ctx.params.result) {
					ctx.call("api.emitSocket", { event: "user.update", data: { id: json._id, minTime } });
				}

				return json;
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async seedDB() {
			await this.adapter.insertMany(require("../data/users"));
		},
	},

	async afterConnected() {
		await this.adapter.collection.createIndex({ minTime: 1 });
	}
};
