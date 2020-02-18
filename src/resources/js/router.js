import Base from './routes/Base'

const unauthenticatedRoute = (path, pathToComponent, extraOptions = {}) => (Object.assign({
	path,
	component: require(pathToComponent + "").default,
	meta: {
		forceAuth: false
	}
}, extraOptions));

const authenticatedRoute = (path, pathToComponent, extraOptions = {}) => (Object.assign({
	path,
	component: require(pathToComponent+ "").default,
	meta: {
		forceAuth: true
	}
}, extraOptions));

export default [
	authenticatedRoute('/', './routes/Base', {
		children: [
			{path: '/', redirect: '/accounts'},
			authenticatedRoute('accounts', './routes/Accounts'),
			authenticatedRoute('dashboard', './routes/Dashboard'),
			authenticatedRoute('transactions', './routes/Transactions'),
			authenticatedRoute('settings', './routes/Settings/SettingsBase', {
				children: [
					authenticatedRoute('/password', './routes/Settings/Password'),
				]
			}),
		],
	})
]