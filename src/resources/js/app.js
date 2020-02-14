import Vue from 'vue';
import boot from './bootstrap'

const { router, store } = boot(Vue);

window.Vue = Vue;
window.Bus = new Vue();

window.app = new Vue({
	router,
	store,
	el: '#app'
})
