const Model = require('./Model')

module.exports = class AccessToken extends Model {
    static get tableName() {
        return 'access_tokens';
    }
    fillable() {
        return [
            'user_id',
            'token',
        ]
    }
}
