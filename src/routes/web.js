const middlewareWithAuthenticatedRedirect = [ app.make('middleware.guest') ].concat(app.make('middleware.web'));

/**
 * @param {Router} router
 */
module.exports = (router) => {
	// The middleware isn't binding for some reason...?
	router.post('/login', app.controller('Auth/LoginController', 'store'), middlewareWithAuthenticatedRedirect);
	router.get('/login', app.controller('Auth/LoginController', 'index'), middlewareWithAuthenticatedRedirect);
	router.get('/register', app.controller('Auth/RegisterController', 'create'), middlewareWithAuthenticatedRedirect);
	router.post('/register', app.controller('Auth/RegisterController', 'store'), middlewareWithAuthenticatedRedirect);

	router.express.get('/broadcasting/auth', (req, res) => {
		var query = req.query;
		var socketId = query.socket_id;
		var channel = query.channel_name;
		var callback = query.callback;

		var presenceData = {
			user_id: 'some_id',
			user_info: {
				name: 'John Smith'
			}
		};

		var auth = JSON.stringify(Bus.pusher.authenticate(socketId, channel, presenceData));
		var cb = callback.replace(/\"/g, '') + '(' + auth + ');';

		res.set({
			'Content-Type': 'application/javascript'
		});

		res.send(cb);
	});

	router.get({
		path: '/api/account_kpis/:account',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/AccountsController', 'showKpi')
	})
	router.get({
		path: '/api/accounts',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/AccountsController', 'index')
	})
	router.get({
		path: '/api/transactions',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/TransactionController', 'index')
	})
	router.put({
		path: '/api/accounts/:account',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/AccountsController', 'patch')
	})

	router.get({
		path: '/api/tokens',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/TokensController', 'index')
	})

	router.post({
		path: '/api/sync-tokens',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/TokensController', 'refreshTheAccounts')
	})
	router.post({
		path: '/api/hass-io-controller',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/HassIoController', 'info')
	})
	router.post({
		path: '/api/sync-transactions',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/TransactionController', 'refreshTheTransactions')
	})

	router.post({
		path: '/api/plaid_exchange_token',
		middleware: app.make('middleware.api'),
		resource: app.controller('Api/PlaidController', 'exchange')
	})

	router.get({
		path: '/:route?/:id?',
		middleware: app.make('middleware.auth'),
		resource: app.controller('HomeController', 'spaRoute')
	});
};
