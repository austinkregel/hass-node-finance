const Category = app.require('app/Category');
const Command = require('forge-cli/src/Command');
const dayjs = require('dayjs');
const plaid = require('plaid');
const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Node Finance'}
);
const promiseMe = () =>
    new Promise((resolve, reject) =>
        client.getCategories((err, response) => {
            if (err) {
                reject(err)
            }
            resolve(response)
        })
    )

module.exports = class SeedCategories extends Command {
    constructor(context) {
        super(context);
        this.signature = 'seed:categories'
    }
    async handle() {
        await app.knex.raw('delete from categories where true');
        await app.knex.raw('delete from category_transactions where true');
        const { categories } = await promiseMe();

        for (let index in categories) {
            const category = categories[index];

            for (let i in category.hierarchy) {
                const hierarchy = category.hierarchy[i];

                const possibleMatches = await Category.query().where('name', hierarchy);

                if (possibleMatches.length > 0) {
                    continue;
                }

                await Category.create({
                    name: hierarchy,
                    category_id: category.category_id,
                })
            }
        }
        console.log("Finished, you may close this app.");

        app.close();
    }
}