import VueRouter from 'vue-router';
import Zondicon from 'vue-zondicons'
import state from './state';
import routes from './router';
import axios from 'axios';
import Vuex from 'vuex'
import Const from './constants'
import VueToasted from 'vue-toasted';
import { buildUrl } from '@kbco/query-builder';
import VueApexCharts from 'vue-apexcharts'
import dayjs from "dayjs";

window.buildUrl = buildUrl;
window.dayjs = dayjs;

const setupAxios = () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    window.axios = axios.create({
        baseURL: process.env.MIX_APP_URL || 'you-need-to-set-your-app-url',
        cancelToken: source.token
    });

    window.axios.cancel = (message) => {
        // cancel the requests
        source.cancel(message);
        setupAxios();
    }

    window.axios.interceptors.response.use(undefined, function (err) {
        return new Promise(function (resolve, reject) {
            if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
                app.$store.dispatch(Const.AUTH_LOGOUT)
            }
            throw err;
        });
    });
}

setupAxios();

export default (Vue) => {
    Vue.use(VueRouter);
    Vue.use(Vuex);
    Vue.use(VueToasted);
    Vue.component('apexchart', VueApexCharts)
    Vue.component('zondicon', Zondicon);

    // This will automatically register .vue files as components based on the file name.
    const files = require.context('./components', true, /\.vue$/i);
    files.keys().map((key) => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

    const store = new Vuex.Store(state);

    const router = new VueRouter({
        mode: 'history',
        routes,
    })

    router.beforeEach(async (to, from, next) => {
        if (to.meta.forceAuth) {
            await store.dispatch('checkIfWeAreLoggedIn', {
                router,
                route: to,
            })
        }
        next();
    });

    return {
        router,
        store
    }
}
