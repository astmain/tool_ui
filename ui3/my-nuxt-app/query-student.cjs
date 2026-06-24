const pg = require('pg');
const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:123456@localhost:2001/mydb?schema=public',
});
async function main() {
  const r = await pool.query('SELECT * FROM "student"');
  console.log(JSON.stringify(r.rows, null, 2));
  await pool.end();
}
main();
