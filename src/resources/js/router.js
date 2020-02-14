import Base from './routes/Base'
import AuthBase from "./routes/Auth/AuthBase";

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
			unauthenticatedRoute('auth', './routes/Auth/AuthBase', {
				children: [
					unauthenticatedRoute('login/:type?', './routes/Auth/Login'),
					unauthenticatedRoute('callback/:type(.*)',  './routes/Auth/Callback'),
				]
			}),

			unauthenticatedRoute('/auth/register', './routes/Auth/Register'),
			unauthenticatedRoute('/auth/register/:type', './routes/Auth/RegisterDetails'),

			authenticatedRoute('*', './components/Icons/Broker')
		],
	})
]