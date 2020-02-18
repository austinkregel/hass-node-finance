<template>
    <div>
        <div class="w-full md:w-3/5 mx-auto">
            <div class="flex flex-wrap mt-4 items-center justify-between">
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
            <div class="flex flex-col">
                <div class="flex flex-wrap w-full rounded mt-4 -mx-2">
                    <single-transaction class="w-full" v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" />
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
            }
        },
        methods: {
            async getTransactions() {
                let { data: transactions } = await axios.get(buildUrl('/api/transactions', {
                    filter: {
                        date: '>:' + dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
                    },
                    'include': '[account,categories]'
                }));

                this.transactions = transactions;
            },
            async syncTransactions() {
                await axios.post(buildUrl('/api/sync-transactions'));
                await this.getTransactions();

            }
        },
        mounted() {
            this.getTransactions();
        }
    }
</script>

<style scoped>

</style>