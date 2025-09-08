const mysql = require("mysql2/promise");

exports.handler = async (event) => {
  // Amplify 環境変数から取得
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute(
    "SELECT value FROM test_table LIMIT 1"
  );
  await connection.end();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rows[0]),
  };
};
