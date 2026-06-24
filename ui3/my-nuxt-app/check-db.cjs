const pg = require('pg');
const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:123456@localhost:2001/mydb?schema=public',
});

async function main() {
  const now = new Date().toISOString();

  // 读取现有数据
  const [roles, users] = await Promise.all([
    pool.query('SELECT "id", "key" FROM "role"'),
    pool.query('SELECT "id", "nickname" FROM "user"'),
  ]);
  const roleIds = new Map(roles.rows.map(r => [r.key, r.id]));
  const userIds = new Map(users.rows.map(r => [r.nickname, r.id]));
  const userRoleRows = await pool.query('SELECT "user_id","role_id" FROM "user_role"');
  const urSet = new Set(userRoleRows.rows.map(r => `${r.user_id}-${r.role_id}`));

  const inserts = [];

  // role: 缺 USER_VIP2 (id=7)
  if (!roleIds.has('USER_VIP2')) {
    inserts.push(pool.query(`INSERT INTO "role" ("id","name","key","description","status","order_num","created_at","updated_at") VALUES (7,'高级会员2','USER_VIP2','高级会员2-拥有web-部分权限',TRUE,0,'${now}','${now}')`));
  }

  // user: 缺 front (id=3)
  if (!userIds.has('front')) {
    inserts.push(pool.query(`INSERT INTO "user" ("id","nickname","email","password","remark","created_at","updated_at") VALUES (3,'front','front@front.com','$2a$10$vVp2nvPa0n7lELrD8OPYNe6QIQSL8Ba0WjZczxSlcbSXxh4CI1GDy','测试用户','${now}','${now}')`));
  }

  // user_role: 缺 userId=3->roleId=4, userId=1->roleId=4
  if (!urSet.has('3-4')) {
    inserts.push(pool.query(`INSERT INTO "user_role" ("user_id","role_id","created_at") VALUES (3,4,'${now}')`));
  }
  if (!urSet.has('1-4')) {
    inserts.push(pool.query(`INSERT INTO "user_role" ("user_id","role_id","created_at") VALUES (1,4,'${now}')`));
  }

  // article_category
  const catCount = await pool.query('SELECT COUNT(*) FROM "article_category"');
  if (parseInt(catCount.rows[0].count) === 0) {
    inserts.push(pool.query(`INSERT INTO "article_category" ("id","name","sort","created_at") VALUES (1,'111',0,'${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_category" ("id","name","sort","created_at") VALUES (2,'222',0,'${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_category" ("id","name","sort","created_at") VALUES (3,'333',0,'${now}')`));
  }

  // article_info
  const artCount = await pool.query('SELECT COUNT(*) FROM "article_info"');
  if (parseInt(artCount.rows[0].count) === 0) {
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (1,'111','111-111',1,TRUE,1,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (2,'222','222-222',0,TRUE,2,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (3,'222','222',0,TRUE,2,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (4,'1111','111-111',0,TRUE,1,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (5,'1111111','1111111111111111111111',0,TRUE,2,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (6,'111','1111',0,TRUE,2,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (7,'1111111','1111111111',0,TRUE,2,'${now}','${now}')`));
    inserts.push(pool.query(`INSERT INTO "article_info" ("id","title","content","sort","deleted","category_id","created_at","updated_at") VALUES (8,'111','111111111111',111,FALSE,1,'${now}','${now}')`));
  }

  // student
  const stuCount = await pool.query('SELECT COUNT(*) FROM "student"');
  if (parseInt(stuCount.rows[0].count) < 6) {
    const stuData = [
      [1, '111', 11, 186, 405, '组A', 'blue', 80, 140, 100],
      [2, '11', 11, 183, 304, '组B', 'red', 81, 140, 100],
      [3, '22', 22, 559, 300, '组C', 'green', 82, 140, 100],
      [4, '2222', 2222, 598, 400, '组D', 'orange', 83, 140, 100],
      [5, '2', 2, 527, 201, '组E', 'purple', 84, 140, 100],
      [6, '1', 1, 160, 205, '组F', 'yellow', 85, 140, 100],
    ];
    for (const [id, name, age, x, y, group_name, group_color, z_index, width, height] of stuData) {
      inserts.push(pool.query(`INSERT INTO "student" ("id","name","age","x","y","group_name","group_color","z_index","width","height","created_at","updated_at") VALUES (${id},'${name}',${age},${x},${y},'${group_name}','${group_color}',${z_index},${width},${height},'${now}','${now}') ON CONFLICT ("id") DO NOTHING`));
    }
  }

  if (inserts.length > 0) {
    await Promise.all(inserts);
    console.log(`已插入 ${inserts.length} 条 INSERT 语句`);
  } else {
    console.log('无需插入数据');
  }

  // 最终验证
  const tables = ['role', 'user', 'menu', 'role_menu_permission', 'user_role', 'article_category', 'article_info', 'student', 'setting'];
  console.log('\n--- 最终数据量 ---');
  for (const t of tables) {
    const r = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
    console.log(`${t}: ${r.rows[0].count}`);
  }
  await pool.end();
}

main();
