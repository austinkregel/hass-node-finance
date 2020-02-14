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
		path: '/:route?/:id?',
		middleware: app.make('middleware.auth'),
		resource: app.controller('HomeController', 'spaRoute')
	});
};
