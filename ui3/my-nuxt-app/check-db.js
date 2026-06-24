const pg = require('pg');
const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:123456@localhost:2001/mydb?schema=public',
});

async function main() {
  const tables = ['role', 'user', 'menu', 'role_menu_permission', 'user_role', 'article_category', 'article_info', 'student', 'setting'];

  for (const t of tables) {
    try {
      const res = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
      console.log(`${t}: ${res.rows[0].count}`);
    } catch (e) {
      console.log(`${t}: ERROR - ${e.message}`);
    }
  }
  await pool.end();
}

main();
