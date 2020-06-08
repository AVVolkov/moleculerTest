"use strict";

const DbService	= require("moleculer-db");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function(collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema = {
		mixins: [DbService],

		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			}
		},

		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {any} json
			 * @param {Context} ctx
			 */
			async entityChanged(type, json, ctx) {
				ctx.broadcast(cacheCleanEventName);
			}
		},

		async started() {
			if (this.seedDB) {
				const count = await this.adapter.count();

				if (count !== 0) {
					return;
				}

				this.logger.info(`The '${collection}' collection is empty. Seeding the collection...`);
				await this.seedDB();
				this.logger.info("Seeding is done. Number of records:", await this.adapter.count());
			}
		}
	};

	const MongoAdapter = require("moleculer-db-adapter-mongo");

	schema.adapter = new MongoAdapter(process.env.MONGO_URI || "mongodb://localhost:27017");
	schema.collection = collection;

	return schema;
};
