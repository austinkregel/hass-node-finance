echo "[!] Starting the finance application..."

cd /finance
npm install -g --unsafe-perm knex cross-env sqlite3 nodemon
npm install
knex migrate:latest
npm run dev-fe

node app