<template>
    <div>
        <div class="w-full">
            <div class="flex flex-wrap m-4 px-2 items-center justify-between">
                <div class="flex flex-col">
                    <div class="text-xl">Transactions</div>
                    <div v-if="transactions.length > 0">
                        <div class="flex flex-wrap text-xs">
                            {{ transactions.length }} transactions<span v-if="transactions.length !== 1">s</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap justify-end items-center pt-4">
                    <button @click.prevent="syncTransactions" class="rounded ml-auto mb-3 mr-4">
                        <zondicon icon="refresh" class="w-6 h-6 fill-current text-blue-500"/>
                    </button>
                </div>
            </div>
            <div class="flex flex-col mx-4">
                <div class="flex flex-wrap w-full rounded">
                    <single-transaction class="w-full" v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
                    <div class="my-4 italic text-center w-full" v-if="!hasMorePages">There are no more transactions...</div>
                    <div class="my-4 italic text-center w-full" v-else>
                        <button @click="loadNextPage" class="py-2 px-4 border-blue-500 rounded border text-blue-500 hover:bg-blue-500 hover:text-white">
                            Load more...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SingleTransaction from "../components/SingleTransaction";
    export default {
        components: {SingleTransaction},
        data() {
            return {
                transactions: [],
                hasMorePages: false,
                page: 1,
                limit: 15,
            }
        },
        methods: {
            async getTransactions() {
                let { data: { data: transactions, hasMorePages } } = await axios.get(buildUrl('/api/transactions', {
                    filter: {
                        date: '>:' + dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
                    },
                    'include': '[account,categories]',
                    page:  this.page,
                    limit:  this.limit
                }));

                this.hasMorePages = hasMorePages;
                this.transactions.push(...(transactions));
            },
            async syncTransactions() {
                await axios.post(buildUrl('/api/sync-transactions'));
                await this.getTransactions();
            },
            async loadNextPage() {
                this.page++;
                this.getTransactions()
            }
        },
        mounted() {
            this.getTransactions();
        }
    }
</script>

<style scoped>

</style>