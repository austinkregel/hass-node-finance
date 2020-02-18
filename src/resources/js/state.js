export default {
	state: {
		accounts: {},
		accountKpis: {}
	},
	getters: {
		accountkpis: state => state
	},
	mutations: {
		setGeneric(state, thingsToSet = {}) {
			state = Object.assign(state, thingsToSet);
		},
	},
	actions: {
		async checkIfWeAreLoggedIn({ state, getters }, { route, router }) {
			return true;
		},

		async getAccountKpis({ commit, state }, account) {
			let { data: accountKpis } = await axios.get(buildUrl('/api/account_kpis/' + account.account_id, {
				filter: {
					date: '>:' + dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
				}
			}));
			commit('setGeneric', { accounts: Object.assign(state.accounts, {
				[account.id]: accountKpis
			})})
		}
	}
}