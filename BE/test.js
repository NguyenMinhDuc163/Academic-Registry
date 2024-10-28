require('dotenv').config();
const dbConnect = require('./src/configs/db.config'); // Ensure this is the correct path to your dbConnect file
const sql = require('mssql');

const daysOfWeek = ['2024-11-13','2024-11-20'];
const kips = ['Sang', 'Chieu'];
const weeks = ['Tu tuan 1 den 16', 'Tu tuan 10 den 26'];

async function insertRandomDatesToMonHoc() {
    try {
        const db = await dbConnect();
        const request = new sql.Request(db);

        // Lấy danh sách các môn học chưa có thời gian học
        const monHocList = await request.query(`
            SELECT mon_hoc_id FROM mon_hoc
        `);

        for (const monHoc of monHocList.recordset) {
            // Lựa chọn ngẫu nhiên cho từng môn học
            const ngay = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
            const kip = kips[Math.floor(Math.random() * kips.length)];
            const tuan = weeks[Math.floor(Math.random() * weeks.length)];

            // Cập nhật vào bảng `mon_hoc`
            await request.query(`
                UPDATE mon_hoc
                SET ngay = '${ngay}', kip = '${kip}', tuan = '${tuan}'
                WHERE mon_hoc_id = '${monHoc.mon_hoc_id}'
            `);

            console.log(`Đã cập nhật thời gian cho môn học ID: ${monHoc.mon_hoc_id} - Ngày: ${ngay}, Kíp: ${kip}, Tuần: ${tuan}`);
        }

        console.log('Hoàn tất cập nhật thời gian ngẫu nhiên cho các môn học.');
    } catch (error) {
        console.error('Lỗi khi cập nhật thời gian ngẫu nhiên:', error);
    } finally {
        sql.close();  // Đảm bảo đóng kết nối SQL sau khi thực hiện xong
    }
}

// Gọi hàm để thực hiện cập nhật
insertRandomDatesToMonHoc();
