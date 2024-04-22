const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'NguyenDuc@163',
    server: 'localhost',
    database: 'AcademicRegistryDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function fetchData() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server successfully!');

        // Thực hiện truy vấn
        const result = await sql.query('SELECT * FROM bo_mon');
        console.log(result.recordset); // In kết quả truy vấn
    } catch (err) {
        console.error('Error when fetching data:', err);
    } finally {
        sql.close(); // Đóng kết nối
    }
}

fetchData();
