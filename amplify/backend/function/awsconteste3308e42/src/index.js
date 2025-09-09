const mysql = require("mysql2/promise");

exports.handler = async (event) => {
  console.log("Lambda invoked", JSON.stringify(event));

  let connection;
  try {
    console.log("Connecting to RDS...");
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("RDS connection established");

    console.log("Executing query...");
    const [rows] = await connection.execute(
      "SELECT value FROM test_table LIMIT 1"
    );
    console.log("Query result:", rows);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 追加
      },
      body: JSON.stringify(rows[0] || {}),
    };
  } catch (err) {
    console.error("Error occurred:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 追加
      },
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("RDS connection closed");
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
};
