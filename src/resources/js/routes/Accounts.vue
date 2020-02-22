<template>
    <div class="m-4">
        <div class="flex flex-wrap items-center justify-between">
            <div class="flex flex-col">
                <div class="text-xl">Accounts</div>
                <div v-if="tokens.length > 0">
                    <div class="flex flex-wrap text-xs">
                        {{ tokens.length }} token<span v-if="tokens.length !== 1">s</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap justify-end items-center">
                <button @click.prevent="refreshThings" class="rounded ml-auto mb-3 mr-4">
                    <zondicon icon="refresh" class="w-6 h-6 fill-current text-blue-500" :class="{rotate: refreshing}"/>
                </button>
                <button @click.prevent="openHandler" class="bg-blue-500 text-white p-2 rounded ml-auto mb-3 shadow">
                    Link new account
                </button>
            </div>
        </div>

        <div class="rounded mt-4">
            <div v-if="accounts.length > 0" >
                <div class="flex flex-wrap items-center justify-between bg-white px-4 py-2 shadow my-4" v-for="account in accounts">
                    <div class="flex flex-wrap items-center">
                        <div>
                            <zondicon v-if="account.type === 'depository'" class="w-8 h-8 text-gray-500 fill-current" icon="wallet" />
                            <zondicon v-else-if="account.type === 'credit'" class="w-8 h-8 text-gray-500 fill-current" icon="credit-card" />
                            <zondicon v-else-if="account.type === 'investment'" class="w-8 h-8 text-gray-500 fill-current" icon="library" />
                            <zondicon v-else-if="account.type === 'loan'" class="w-8 h-8 text-gray-500 fill-current" icon="education" />
                            <zondicon v-else class="w-8 h-8 text-gray-500 fill-current" icon="home" />
                        </div>
                        <div class="flex flex-col ml-4">
                            <div class="text-lg font-medium text-gray-500">{{ account.name }} - {{ account.subtype }}</div>
                            <div><span class="text-lg font-bold">${{ (account.available || account.balance).toFixed(2) }}</span> / {{ account.balance.toFixed(2) }}</div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <span>{{ account.updated_at}}</span>
                        <button class="pl-4 py-2 focus:outline-none" @click.prevent="() => favorite(account)">
                            <zondicon icon="star-full" class=" w-4 h-4 fill-current" :class="{'text-yellow-600': account.is_favorite, 'text-gray-500': !account.is_favorite }" ></zondicon>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-center italic">
                No accounts connected...
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [],
        data() {
            return {
                accounts: [],
                tokens: [],
                handler: null,
                refreshing: false
            }
        },
        methods: {
            async getAccounts() {
                let { data: accounts } = await axios.get('/api/accounts');

                this.accounts = accounts;
            },
            async getTokens() {
                let { data: tokens } = await axios.get('/api/tokens');

                this.tokens = tokens;
            },
            openHandler() {
                this.handler.open();
            },
            refreshThings() {
                this.refreshing = true;
                axios.post('/api/sync-tokens')
                    .then((res) => {
                        this.getAccounts();
                        this.refreshing = false;
                    })
                    .catch((res) => {
                        this.getAccounts();
                        this.refreshing = false;
                    })
            },
            favorite(account) {
                console.log({ fav: !account.is_favorite})
                axios.put('/api/accounts/' + account.id, {
                    is_favorite: !account.is_favorite,
                })
                    .then(res => this.getAccounts())
                    .catch(res => this.getAccounts())
            }
        },
        mounted() {
            if (!process.env.MIX_PLAID_ENV) {
                throw "You must set your MIX_PLAID_ENV env variable!"
            }
            if (!process.env.MIX_PLAID_PUBLIC_KEY) {
                throw "You must set your MIX_PLAID_PUBLIC_KEY env variable!"
            }

            this.getAccounts();
            this.getTokens();
            this.handler = Plaid.create({
                clientName: 'Kregel API',
                env: process.env.MIX_PLAID_ENV,
                key: process.env.MIX_PLAID_PUBLIC_KEY,
                product: ['transactions'],
                // webhook: this.url,
                selectAccount: false,
                onSuccess(public_token, metadata) {
                    console.log({public_token, metadata})
                    axios.post('/api/plaid_exchange_token', {
                        public_token: public_token,
                        institution: metadata.institution.institution_id
                    })
                        .then((res) => {
                            this.getTokens();
                            this.getAccounts();
                        })
                        .catch((res) => {
                            this.getTokens();
                            this.getAccounts();
                        });
                }
            });
        }
    }
</script>