const express = require("express");
const sql = require('mssql');
const dbConnect = require("../configs/db.config");
const apiResponse = require("../utils/responseHelper"); // Đảm bảo đường dẫn này chính xác
const router = express.Router();

//http://localhost:3000/api/v1

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const db = await dbConnect();
        const userResult = await db.request()
            .input('username', sql.NVarChar, username)
            .execute('sp_UserLogin');

        if (userResult.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Khong tim thay tai khoan');
        }

        const user = userResult.recordset[0];
        if (user.password !== password) {
            return apiResponse(res, 401, null, 'Sai mat khau');
        }

        apiResponse(res, 200, user, 'Dang nhap thanh cong');
    } catch (error) {
        console.error(error);
        apiResponse(res, 500, null, 'Loi dang nhap');
    }
});

// lay tat ca khoa hoc
router.get('/all-course', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.request().execute('sp_GetAllCourses');

        if (result.recordset.length === 0) {
            apiResponse(res, 404, null, 'Không tìm thấy dữ liệu trong bảng mon_hoc');
        } else {
            apiResponse(res, 200, result.recordset, 'Danh sách môn học');
        }
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy dữ liệu môn học');
    }
});



// dang ki mon hoc

// router.post('/dang-ki', async (req, res) => {
//     const { sinh_vien_id, danh_sach_mon_hoc } = req.body;
//
//     if (!sinh_vien_id || !Array.isArray(danh_sach_mon_hoc) || danh_sach_mon_hoc.length === 0) {
//         return apiResponse(res, 400, null, 'Thiếu hoặc dữ liệu đầu vào không hợp lệ');
//     }
//
//     try {
//         const db = await dbConnect();
//         const result = await db.request()
//             .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
//             .input('danh_sach_mon_hoc', sql.NVarChar, danh_sach_mon_hoc.join(','))
//             .execute('sp_DangKiMonHoc');
//
//         const resultMessages = result.recordset[0].resultMessages;
//         apiResponse(res, 201, resultMessages, 'Kết quả đăng ký');
//     } catch (error) {
//         console.error('Lỗi khi gọi stored procedure:', error);
//         apiResponse(res, 500, null, 'Lỗi máy chủ khi đăng ký môn học');
//     }
// });

router.post('/dang-ki', async (req, res) => {
    const { sinh_vien_id, danh_sach_mon_hoc } = req.body;

    if (!sinh_vien_id || !Array.isArray(danh_sach_mon_hoc) || danh_sach_mon_hoc.length === 0) {
        console.log('Dữ liệu đầu vào không hợp lệ');
        return apiResponse(res, 400, null, 'Thiếu hoặc dữ liệu đầu vào không hợp lệ');
    }

    try {
        const db = await dbConnect();
        const transaction = new sql.Transaction(db);
        await transaction.begin();

        const request = new sql.Request(transaction);

        // Kiểm tra sinh viên tồn tại
        const checkSinhVien = await request.query(`SELECT 1 FROM sinh_vien WHERE sinh_vien_id = '${sinh_vien_id}'`);
        if (checkSinhVien.recordset.length === 0) {
            console.log(`Sinh viên với ID ${sinh_vien_id} không tồn tại`);
            throw new Error('Sinh viên không tồn tại');
        }

        const resultMessages = [];
        let successCount = 0;

        for (const mon_hoc_id of danh_sach_mon_hoc) {
            // Tìm lớp học phần và thời gian học tương ứng trong `mon_hoc`
            const findLopHp = await request.query(`
                SELECT TOP 1 lop_hp.lop_hp_id, mh.ngay, mh.kip, mh.tuan
                FROM lop_hp
                JOIN mon_hoc_dang_ki ON lop_hp.mh_ki_id = mon_hoc_dang_ki.mh_ki_hoc_id
                JOIN mon_hoc mh ON mon_hoc_dang_ki.mon_hoc_id = mh.mon_hoc_id
                WHERE mh.mon_hoc_id = '${mon_hoc_id}'
            `);

            if (findLopHp.recordset.length === 0) {
                const message = `Không tìm thấy lớp học phần cho môn học ${mon_hoc_id}`;
                resultMessages.push(message);
                console.log(message);
                continue;
            }
            const { lop_hp_id, ngay, kip, tuan } = findLopHp.recordset[0];

            // Tạo ID mới cho bảng đăng ký
            const newDangKiIdResult = await request.query(`
                SELECT CONCAT('DK', FORMAT(ISNULL(MAX(CAST(SUBSTRING(dang_ki_id, 3, LEN(dang_ki_id) - 2) AS INT)), 0) + 1, '00')) AS new_dang_ki_id
                FROM dang_ki
            `);
            const new_dang_ki_id = newDangKiIdResult.recordset[0].new_dang_ki_id;

            // Kiểm tra xem sinh viên đã đăng ký lớp học phần này chưa
            const checkDangKi = await request.query(`
                SELECT 1 FROM dang_ki WHERE sinh_vien_id = '${sinh_vien_id}' AND lop_hp_id = '${lop_hp_id}'
            `);
            if (checkDangKi.recordset.length > 0) {
                const message = `Sinh viên đã đăng ký lớp học phần ${lop_hp_id}`;
                resultMessages.push(message);
                console.log(message);
                continue;
            }

            // Kiểm tra xung đột lịch với các lớp học phần đã đăng ký
            const checkConflict = await request.query(`
                SELECT 1
                FROM thoi_khoa_bieu tkb
                JOIN dang_ki dk ON tkb.lop_hp_id = dk.lop_hp_id
                WHERE dk.sinh_vien_id = '${sinh_vien_id}'
                  AND tkb.ngay = '${ngay}'
                  AND tkb.kip = '${kip}'
                  AND tkb.tuan = '${tuan}'
            `);

            if (checkConflict.recordset.length > 0) {
                const message = `Lớp học phần ${lop_hp_id} bị trùng lịch với môn khác trong thời khóa biểu`;
                resultMessages.push(message);
                console.log(message);
                continue;
            }

            // Chèn vào bảng đăng ký
            await request.query(`
                INSERT INTO dang_ki (dang_ki_id, sinh_vien_id, lop_hp_id)
                VALUES ('${new_dang_ki_id}', '${sinh_vien_id}', '${lop_hp_id}')
            `);
            const successMessage = `Đã đăng ký thành công lớp học phần ${lop_hp_id}`;
            resultMessages.push(successMessage);
            console.log(successMessage);
            successCount++;

            // Tạo ID cho thời khóa biểu mới
            const newTkbIdResult = await request.query(`
                SELECT CONCAT('TKB', FORMAT(ISNULL(MAX(CAST(SUBSTRING(tkb_id, 4, LEN(tkb_id) - 3) AS INT)), 0) + 1, '00')) AS new_tkb_id
                FROM thoi_khoa_bieu
            `);
            const new_tkb_id = newTkbIdResult.recordset[0].new_tkb_id;

            // Thêm vào thời khóa biểu với thời gian đã chọn từ `mon_hoc`
            await request.query(`
                INSERT INTO thoi_khoa_bieu (tkb_id, lop_hp_id, ngay, kip, phong_hoc_id, tuan)
                VALUES ('${new_tkb_id}', '${lop_hp_id}', '${ngay}', '${kip}', 'PH01', '${tuan}')
            `);
        }

        await transaction.commit();

        // Xác định phản hồi dựa trên số lượng đăng ký thành công
        if (successCount === 0) {
            console.log('Không thể đăng ký bất kỳ lớp học phần nào');
            return apiResponse(res, 400, resultMessages.join('. '), 'Không thể đăng ký bất kỳ lớp học phần nào');
        } else if (successCount < danh_sach_mon_hoc.length) {
            console.log('Một số lớp học phần đã đăng ký thành công, một số gặp xung đột');
            return apiResponse(res, 200, resultMessages.join('. '), 'Một số lớp học phần đã đăng ký thành công, một số gặp xung đột');
        } else {
            console.log('Tất cả lớp học phần đã đăng ký thành công');
            return apiResponse(res, 201, resultMessages.join('. '), 'Tất cả lớp học phần đã đăng ký thành công');
        }
    } catch (error) {
        console.error('Lỗi khi thực hiện đăng ký môn học:', error);
        return apiResponse(res, 500, null, 'Lỗi máy chủ khi đăng ký môn học');
    }
});


router.delete('/dang_ki', async (req, res) => {
    const { sinh_vien_id, mon_hoc_id } = req.body;

    if (!sinh_vien_id || !mon_hoc_id) {
        return apiResponse(res, 400, null, 'Thiếu thông tin sinh_vien_id hoặc mon_hoc_id');
    }

    try {
        // Kết nối tới cơ sở dữ liệu
        const db = await dbConnect();

        // Gọi stored procedure
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .input('mon_hoc_id', sql.NVarChar, mon_hoc_id)
            .execute('sp_XoaDangKi');

        apiResponse(res, 200, null, 'Xóa lớp học phần đã đăng ký thành công');
    } catch (error) {
        if (error.message.includes('Không tìm thấy')) {
            return apiResponse(res, 404, null, 'Không tìm thấy lớp học phần đăng ký phù hợp');
        }

        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
        apiResponse(res, 500, null, 'Lỗi server: Không thể xóa lớp học phần');
    }
});



router.put('/dang_ki', async (req, res) => {
    const { sinh_vien_id, mon_hoc_id_cu, mon_hoc_id_moi } = req.body;

    if (!sinh_vien_id || !mon_hoc_id_cu || !mon_hoc_id_moi) {
        return apiResponse(res, 400, null, 'Thieu sinh_vien_id, mon_hoc_id_cu, hoac mon_hoc_id_moi trong yeu cau');
    }

    try {
        // Kết nối tới cơ sở dữ liệu
        const db = await dbConnect();

        // Gọi stored procedure
        await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .input('mon_hoc_id_cu', sql.NVarChar, mon_hoc_id_cu)
            .input('mon_hoc_id_moi', sql.NVarChar, mon_hoc_id_moi)
            .execute('sp_CapNhatDangKi');

        apiResponse(res, 200, null, 'Cap nhat dang ki mon hoc thanh cong');
    } catch (error) {
        if (error.message.includes('Không tìm thấy')) {
            return apiResponse(res, 404, null, error.message);
        }

        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Loi server khi cap nhat dang ki mon hoc');
    }
});


router.get('/mon-hoc-dky/:sinhVienId', async (req, res) => {
    const { sinhVienId } = req.params;

    try {
        const db = await dbConnect();

        // Gọi stored procedure đã cập nhật
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinhVienId)
            .execute('sp_LayDanhSachMonHocDaDangKy');

        // Xử lý kết quả trả về
        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Không tìm thấy môn học cho sinh viên');
        }

        apiResponse(res, 200, result.recordset, 'Danh sách môn học sinh viên đã đăng ký');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy dữ liệu môn học đã đăng ký');
    }
});

// lay thoi khoa bieu
router.get('/thoi-khoa-bieu/:sinh_vien_id', async (req, res) => {
    const { sinh_vien_id } = req.params;

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .execute('sp_LayThoiKhoaBieuSinhVien');

        // Kiểm tra xem có dữ liệu hay không
        if (result.recordset.length === 0 || (result.recordset[0] && result.recordset[0].Error === 'NoSchedule')) {
            return apiResponse(res, 404, null, result.recordset[0] ? result.recordset[0].ErrorMessage : 'Không tìm thấy thời khóa biểu.');
        }

        // Trả về dữ liệu thời khóa biểu
        apiResponse(res, 200, result.recordset, 'Lấy thời khóa biểu thành công.');

    } catch (error) {
        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy thời khóa biểu.');
    }
});

// lay diem
router.get('/diem', async (req, res) => {
    const { sinh_vien_id } = req.query;

    if (!sinh_vien_id) {
        return apiResponse(res, 400, null, 'Thiếu sinh_vien_id.');
    }

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .execute('sp_LayDiem');

        // Kiểm tra thông báo lỗi hoặc dữ liệu rỗng
        if (result.recordset.length === 0 || (result.recordset[0] && result.recordset[0].Error)) {
            return apiResponse(res, 404, null, result.recordset[0] ? result.recordset[0].ErrorMessage : 'Không có điểm để hiển thị cho sinh viên này.');
        }

        // Nhóm điểm theo môn học
        const groupedScores = result.recordset.reduce((acc, item) => {
            if (!acc[item.ten_mon_hoc]) {
                acc[item.ten_mon_hoc] = [];
            }
            acc[item.ten_mon_hoc].push({
                diem: item.diem,
                ten_dau_diem: item.ten_dau_diem,
                mon_hoc_id: item.mon_hoc_id,
                so_tc: item.so_tc
            });
            return acc;
        }, {});

        const finalScores = Object.keys(groupedScores).map(ten_mon_hoc => ({
            ten_mon_hoc,
            diem: groupedScores[ten_mon_hoc]
        }));

        apiResponse(res, 200, finalScores, 'Lấy điểm thành công.');
    } catch (error) {
        console.error('Error while retrieving student scores:', error);
        apiResponse(res, 500, null, 'Lỗi máy chủ khi lấy điểm của sinh viên.');
    }
});

// Lay diem theo ki hoc
router.get('/diem-ki/:sinh_vien_id/:ki_hoc', async (req, res) => {
    const { sinh_vien_id, ki_hoc } = req.params;

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .input('ki_hoc', sql.NVarChar, ki_hoc)
            .execute('sp_LayDiemTheoKi');

        // Kiểm tra kết quả trả về
        if (result.recordset.length === 0 || (result.recordset[0] && result.recordset[0].Error === 'NoData')) {
            return apiResponse(res, 404, null, result.recordset[0] ? result.recordset[0].ErrorMessage : 'Không tìm thấy thông tin.');
        }

        apiResponse(res, 200, result.recordset, 'Điểm của sinh viên');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy dữ liệu điểm của sinh viên');
    }
});

module.exports = router;
