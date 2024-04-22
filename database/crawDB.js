const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'studentrecordsmanager',
    user: 'root', // username của kết nối mysql
    password: 'NguyenDuc@163' // password của kết nối mysql
});

connection.connect(function (err) {
    if (err) {
        console.log('Error connecting ' + err.stack);
        return;
    } else {
        console.log('Connected as id ' + connection.threadId);
    }
});

connection.query('SELECT * FROM teachers', function (error, results, fields) {
    if (error)
        throw error;
    // Chuyển đổi kết quả thành chuỗi JSON
    const data = JSON.stringify(results, null, 2);
    // Lưu chuỗi JSON vào tệp
    fs.writeFile('output.json', data, 'utf8', (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Data successfully saved to output.json');
        }
    });
});

connection.end(); // Đóng kết nối với cơ sở dữ liệu
