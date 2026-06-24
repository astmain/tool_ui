const pg = require('pg');
const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:123456@localhost:2001/mydb?schema=public',
});

async function main() {
  const res = await pool.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);
  const grouped = {};
  for (const row of res.rows) {
    if (!grouped[row.table_name]) grouped[row.table_name] = [];
    grouped[row.table_name].push(row.column_name);
  }
  for (const [t, cols] of Object.entries(grouped)) {
    console.log(`\n${t}: ${cols.join(', ')}`);
  }
  await pool.end();
}
main();
