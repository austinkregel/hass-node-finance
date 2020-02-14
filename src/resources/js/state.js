export default {
	state: {
		token: localStorage.getItem('token'),
		isLoggedIn: false,
		registerWith: '',
		busy: false,
	},
	getters: {
		busy: (state) => state.busy,
		isLoggedIn: (state) => state.isLoggedIn,
		registerWith: state => state.registerWith
	},
	mutations: {
		setGeneric(state, thingsToSet = {}) {
			state = Object.assign(state, thingsToSet);
		},
		registerWith(state, name) {
			state.registerWith = name;
		},
	},
	actions: {
		async checkIfWeAreLoggedIn({ state, getters }, { route, router }) {
			if (!route.meta.forceAuth) {
				console.log('Not forcing auth!', route)
				// We're already on a page where we know we're not logged in... No need to see if we're authenticated.
				return;
			}
			if (!state.token) {
				router.push('/auth/login');
				return;
			}

			if (getters.tokenExpired) {
				// set logged in to false and redirect to login page.
				state.isLoggedIn = false;
				localStorage.setItem('token', '');
				return app.$router.push('/login');
			}
			// get token from local storage
			// see if it's expired.
			// if it is then refresh it. Otherwise assume we're authenticated.
			//let { data: user } = await axios.get('/api/me');

		},
		async register({ state, getters }, {
			first_name,
			last_name,
			email,
			password,
			timeout
		}) {
			try {
				let { data: payload } = await axios.post('/auth/register', {
					first_name,
					last_name,
					email,
					password,
					timeout
				})
				console.info('Registered!', payload)

				state.token = payload
				localStorage.setItem('token', payload);
			} catch (e) {
				console.error('Failed to register', e)
			}
		}
	}
}