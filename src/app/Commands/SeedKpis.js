const AccountKpi = app.require('app/AccountKpi');
const Account = app.require('app/Account');
const Command = require('forge-cli/src/Command');
const dayjs = require('dayjs');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
module.exports = class SeedKpis extends Command {
    constructor(context) {
        super(context);
        this.signature = 'seed:kpi'
    }
    async handle() {
        const accounts = await Account.query();

        await Promise.all(accounts.map(async account => {
            const startDate = dayjs('2020-01-01');
            const endDate = dayjs();
            const diff = endDate.diff(startDate, 'days');
            let balance = 301.30;
            let daysSincePayday = 0;
            // get random number of transactions to happen on a given day.
            for (let i = 0; i < diff; i++) {
                console.log(account.name, diff);
                const date = startDate.clone().add(i, 'days');
                const transactionsToday = getRandomInt(1, 5);
                let income = 0;
                let negative = 0;

                for (let transLeft = 0; transLeft < transactionsToday; transLeft ++) {
                    if (daysSincePayday === 14) {
                        daysSincePayday = 0;
                        income = getRandomInt(340,  380);
                    }
                    balance += income

                    const randomCost = getRandomInt(5, 30);
                    balance -= randomCost
                    negative += randomCost;
                }

                await AccountKpi.create({
                    'account_id': account.account_id,
                    'balance': balance,
                    'available': balance - 5,
                    'total_transactions': transactionsToday,
                    'transaction_count_positive': income === 0 ? 0 : 1,
                    'transaction_count_negative': transactionsToday,
                    'transaction_sum_positive': income,
                    'transaction_sum_negative': -negative,
                    'date': date.format('YYYY-MM-DD'),
                })

                daysSincePayday++;

            }
        }))
    }
}