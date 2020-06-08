"use strict";

/**
 * Moleculer ServiceBroker configuration file
 *
 * More info about options:
 *     https://moleculer.services/docs/0.14/configuration.html
 */
module.exports = {
	namespace: process.env.NAMESPACE || "DEV",
	nodeID: null,
	metadata: {},

	logger: {
		type: "Console",
		options: {
			colors: true,
			moduleColors: true,
			formatter: "full",
			objectPrinter: null,
			autoPadding: false
		}
	},

	logLevel: "debug",
	transporter: null, //"Redis"
	cacher: "Redis",
	serializer: "JSON",
	requestTimeout: 10000,

	// Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
	retryPolicy: {
		enabled: false,
		retries: 5,
		delay: 100,
		maxDelay: 1000,
		factor: 2,
		check: err => err && !!err.retryable
	},

	// Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
	maxCallLevel: 100,

	// Number of seconds to send heartbeat packet to other nodes.
	heartbeatInterval: 10,
	// Number of seconds to wait before setting node to unavailable status.
	heartbeatTimeout: 30,

	// Cloning the params of context if enabled. High performance impact, use it with caution!
	contextParamsCloning: false,

	// Tracking requests and waiting for running requests before shuting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
	tracking: {
		// Enable feature
		enabled: false,
		// Number of milliseconds to wait before shuting down the process.
		shutdownTimeout: 5000,
	},

	// Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
	disableBalancer: false,

	// Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
	registry: {
		strategy: "RoundRobin",
		preferLocal: true
	},

	// Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
	circuitBreaker: {
		enabled: false,
		threshold: 0.5,
		minRequestCount: 20,
		windowTime: 60,
		halfOpenTime: 10 * 1000,
		check: err => err && err.code >= 500
	},

	// Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
	bulkhead: {
		enabled: false,
		concurrency: 10,
		maxQueueSize: 100,
	},


	validator: true,
	errorHandler: null,

	metrics: {
		enabled: false,
		reporter: {
			type: "Prometheus",
			options: {
				port: 3030,
				path: "/metrics",
				defaultLabels: registry => ({
					namespace: registry.broker.namespace,
					nodeID: registry.broker.nodeID
				})
			}
		}
	},

	tracing: {
		enabled: false,
		exporter: {
			type: "Console", // Console exporter is only for development!
			options: {
				logger: null,
				colors: true,
				width: 100,
				gaugeWidth: 40
			}
		}
	},

	middlewares: [],
	replCommands: null,

	// // Called after broker created.
	// created(broker) {
	// },

	// // Called after broker started.
	// async started(broker) {
	// },

	// // Called after broker stopped.
	// async stopped(broker) {
	// }
};
