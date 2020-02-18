<style scoped>

</style>

<template>
    <div class="flex flex-col shadow rounded p-4 m-2 bg-white" :class="{'text-green-900 ': isPositive, ' text-red-900': !isPositive }"
         :style="(isPositive ? 'border-top: solid #38A169 2px;' : 'border-top: solid #E53E3E 2px;') "
    >
        <div class="flex justify-between items-center -mb-1" :class="{'text-green-800': isPositive, 'text-red-800': isPositive }">
            <div class="font-bold text-lg truncate pr-2 tracking-normal">{{ transaction.name }}</div>
            <div class="font-bold text-lg">${{ Number(-transaction.amount).toFixed(2) }}</div>
        </div>
        <div class="flex justify-between items-center">
            <div v-if="transaction.account" class="text-xs flex-grow tracking-wide">{{ transaction.account.name }} / {{ transaction.account.official_name }}</div>
            <div class="text-xs tracking-wide">{{ prettyDate }}</div>
        </div>

        <div class="flex justify-between items-center">
            <div class="text-xs flex-grow tracking-wide" v-if="transaction.categories">
                {{ transaction.categories.map(cat => cat.name).join(', ') }}
            </div>

            <div class="text-xs font-bold tracking-wide mr-px">
                <div v-if="transaction.pending" class="text-orange-600 flex flex-wrap items-center">
                    Pending
                    <div class="bg-orange-500 w-3 h-3 rounded-full p-1 ml-1"></div>
                </div>
                <div v-else class="text-blue-800 flex flex-wrap items-center">
                    Approved
                    <div class="bg-blue-600 w-3 h-3 rounded-full p-1 ml-1"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['transaction'],

        data() {
            return {}
        },
        computed: {
            isPositive() {
                return Number(this.transaction.amount) < 0;
            },
            prettyDate() {
                return dayjs(this.transaction.date).format('MMMM D, YYYY')
            }
        },
    }
</script>