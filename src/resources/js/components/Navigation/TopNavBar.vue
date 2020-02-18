<template>
    <header class="bg-blue-900 shadow">
        <div class="container sm:flex sm:justify-between sm:items-center sm:py-4 mx-auto">
            <div class="flex items-center justify-between px-4 py-3 sm:p-0">
                <div class="sm:hidden">
                    <button @click="isOpen = !isOpen" type="button" class="block text-gray-500 hover:text-white focus:text-white focus:outline-none">
                        <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            <path v-if="isOpen" fill-rule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                            <path v-if="!isOpen" fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <nav :class="isOpen ? 'block' : 'hidden'" class="px-2 pt-2 pb-4 sm:flex sm:p-0 sm:items-center">
                <router-link to="/accounts" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2">Accounts</router-link>
                <router-link to="/dashboard" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2">Dashboard</router-link>
                <router-link to="/transactions" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2">Transactions</router-link>

                <div class="relative ml-0 sm:ml-4 z-10">
                    <button @click="accountOpen = !accountOpen" class="relative z-10 hidden sm:flex focus:outline-none items-center">
                        <div class="h-10 w-10">
                            <img
                                :class="{'border-white': accountOpen }"
                                class="h-full bg-white p-1 w-full rounded-full shadow border-2 border-transparent object-cover"
                                src="https://placehold.it/50x50" alt="">
                        </div>
                        <zondicon icon="cheveron-down" class="text-white w-4 ml-1 fill-current" />
                    </button>
                    <button @click="accountOpen = false" tabindex="-1"  :class="accountOpen ? 'sm:block' : 'hidden'" class="fixed inset-0  z-0 h-full w-full bg-black opacity-50 cursor-default"></button>
                    <div :class="accountOpen ? 'block' : 'sm:hidden'"  class="sm:absolute right-0 mt-2 py-2 w-48 sm:bg-white  rounded shadow-xl">
                        <div v-for="item in accountNavItems">
                            <router-link v-if="item.type === 'link'" @click.native="closeAccount" :to="item.link" class="block sm:px-4 px-2 py-2 text-white sm:text-gray-800 hover:bg-blue-100">{{ item.name }}</router-link>
                            <button v-else @click.prevent="item.onClick" role="button" class="text-left block w-full sm:px-4 px-2 py-2 text-white sm:text-gray-800 hover:bg-blue-100">{{ item.name }}</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                isOpen: false,
                accountOpen: false,
                accountNavItems: [
                    {
                        link: '/settings/password',
                        name: "Settings",
                        type: 'link'
                    },
                    {
                        name: 'Support',
                        type: 'button',
                        onClick: () => {
                            console.log("Action tbd... Not sure if we want a support button yet.")
                        }
                    },
                    {
                        name: 'Sign out',
                        type: 'button',
                        onClick: this.logout
                    }
                ],
                user: this.$store.getters.currentUser
            }
        },
        methods: {
            async logout() {
                await this.$store.dispatch('logout');
                this.$router.push('/login')
            },
            closeAccount() {
                this.accountOpen = !this.accountOpen
            }
        }
    }
</script>
