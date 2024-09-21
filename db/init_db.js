console.log('Starting DB setup...');

const env = process.env;

db.createUser({
  user: env.DB_USER,
  pwd: env.DB_PASS,
  roles: [{ role: 'readWrite', db: env.DB_NAME }],
});

db.createCollection('urls');

console.log('DB setup finished successfully!');
