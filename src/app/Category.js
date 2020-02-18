const Model = require('./Model')

module.exports = class Category extends Model {
    static get tableName() {
        return 'categories';
    }

    fillable() {
        return [
            'name',
            'category_id',
        ]
    }
}
