require('dotenv').config();
const sql = require('mssql');

const config = {
    server: process.env.SQLSERVER_DB_HOST,
    user: process.env.SQLSERVER_DB_USER,
    password: process.env.SQLSERVER_DB_PASSWORD,
    database: process.env.SQLSERVER_DB_NAME,
    options: {
        encrypt: true,  // for Azure
        trustServerCertificate: true  // for local development
    }
};

async function getSinhVienByKhoa(khoaId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('KhoaID', sql.NVarChar, khoaId)
            .execute('GetSinhVienByKhoa');

        console.log(result.recordset); // Hiển thị kết quả trên console
        return result.recordset;
    } catch (err) {
        console.error('Error when calling stored procedure', err);
    } finally {
        await sql.close(); // Đóng kết nối
    }
}

// Gọi hàm với ID khoa cụ thể
getSinhVienByKhoa('K01'); // Thay đổi giá trị này tùy thuộc vào ID khoa trong cơ sở dữ liệu của bạn
