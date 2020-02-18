<template>
    <div>
        <div class="m-4">
            <apexchart :type="chartOptions.chart.type" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
        <div class="m-4">
            <div v-if="accounts.length > 0" >
                <div class="flex flex-wrap items-center justify-between bg-white px-4 py-2 shadow my-2" v-for="account in accounts">
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
        data() {
            return {
                accounts: [],
                loading: true,
                series: [],
                chartOptions: {
                    chart: {
                        type: 'area'
                    }
                }
            }
        },
        methods: {
            async getAccountKpis(account) {
                this.loading = true;
                let { data: accountKpis } = await axios.get(buildUrl('/api/account_kpis/' + account.account_id, {
                    filter: {
                        date: '>:' + dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
                    }
                }));
                this.chartOptions = {
                    chart: {
                        type: 'area',
                        height: 500,
                        stacked: true,
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: [1, 1, 4]
                    },
                    title: {
                        text: 'Account balances, debits, and credits',
                        align: 'left',
                        offsetX: 110
                    },
                    xaxis: {
                        categories: accountKpis.map(kpi => dayjs(kpi.date).format('MMM D')),
                    },
                    yaxis: [
                        {
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: '#008FFB'
                            },
                            labels: {
                                style: {
                                    color: '#008FFB',
                                }
                            },
                            title: {
                                text: "Balance",
                                style: {
                                    color: '#008FFB',
                                }
                            },
                            tooltip: {
                                enabled: true
                            }
                        },
                        {
                            seriesName: 'Credit transactions',
                            opposite: true,
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: '#fe2438'
                            },
                            labels: {
                                style: {
                                    color: '#fe2438',
                                },
                            },
                            title: {
                                text: "Income",
                                style: {
                                    color: '#fe2438',
                                }
                            }
                        },
                        {
                            seriesName: 'Debit transactions',
                            opposite: true,
                            axisTicks: {
                                show: true,
                            },
                            axisBorder: {
                                show: true,
                                color: '#1efe4b'
                            },
                            labels: {
                                style: {
                                    color: '#1efe4b',
                                }
                            },
                            title: {
                                text: "Debit transactions",
                                style: {
                                    color: '#1efe4b',
                                }
                            },
                        },
                    ],
                    tooltip: {
                        fixed: {
                            enabled: true,
                            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                            offsetY: 30,
                            offsetX: 60
                        },
                    },
                    legend: {
                        horizontalAlign: 'left',
                        offsetX: 40
                    }
                };

                this.series.push({
                    name: account.name + ' balance',
                    type: 'line',
                    data: accountKpis.map(accountKpi => Math.round(accountKpi.balance))
                });

                this.series.push({
                    name: account.name + ' negative',
                    type: 'line',
                    data: accountKpis.map(accountKpi => Math.round(accountKpi.transaction_sum_negative))
                });

                this.series.push({
                    name: account.name + ' positive',
                    type: 'line',
                    data: accountKpis.map(accountKpi => Math.round(accountKpi.transaction_sum_positive))
                });
            },

            async getAccounts() {
                let { data: accounts } = await axios.get(buildUrl('/api/accounts', {
                    filter: {
                        is_favorite: 1,
                    }
                }));

                this.accounts = accounts;
                this.accounts.map(account => this.getAccountKpis(account));
            },
        },
        mounted() {
            this.getAccounts();
        }
    }
</script>
