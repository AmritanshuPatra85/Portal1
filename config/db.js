import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '24158104',
  database: 'project1',
  port: 3306
}).promise();

export default pool;