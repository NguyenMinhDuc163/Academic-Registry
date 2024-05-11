const express = require("express");
const sql = require('mssql');
const dbConnect = require("../configs/db.config");
const apiResponse = require("../utils/responseHelper"); // Đảm bảo đường dẫn này chính xác
const router = express.Router();

//http://localhost:3000/api/v1

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log( username, password );
    try {
        const db = await dbConnect();
        const userResult = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT tai_khoan_id, username, password, full_name, birth, email, ten_khoa, vai_tro FROM tai_khoan WHERE username = @username');

        if (userResult.recordset.length === 0) {
            // return apiResponse(res, 404, null, 'User not found');
            return apiResponse(res, 404, null, 'Khong tim thay tai khoan');
        }

        const user = userResult.recordset[0];
        if (user.password !== password) {
            // return apiResponse(res, 401, null, 'Incorrect password');
            return apiResponse(res, 401, null, 'Sai mat khau');
        }

        apiResponse(res, 200, user, 'Dang nhap thanh cong');
    } catch (error) {
        console.error(error);
        // apiResponse(res, 500, null, 'Failed to login due to server error');
        apiResponse(res, 500, null, 'Loi dang nhap');
    }
});

// lay tat ca khoa hoc
router.get('/all-course', async (req, res) => {
    try {
        const db = await dbConnect();
        const query = `
            SELECT mon_hoc_id, so_tc, ten_mon_hoc, bo_mon_id
            FROM mon_hoc`;

        const result = await db.request().query(query);

        if (result.recordset.length === 0) {
            // res.status(404).json({ message: 'No data found in mon_hoc table' });
            apiResponse(res, 404, null, 'Khong tim thay du lieu trong bang mon_hoc');
        } else {
            // res.status(200).json(result.recordset);
            apiResponse(res, 200, result.recordset, 'Danh sach mon hoc');
        }
    } catch (error) {
        console.error('Database query error:', error);
        // res.status(500).json({ message: 'Failed to retrieve mon_hoc data due to server error' });
        apiResponse(res, 500, null, 'Loi khi lay du lieu mon hoc');
    }
});


// dang ki mon hoc
router.post('/dang-ki', async (req, res) => {
    const { sinh_vien_id, danh_sach_mon_hoc } = req.body;

    if (!sinh_vien_id || !Array.isArray(danh_sach_mon_hoc) || danh_sach_mon_hoc.length === 0) {
        // return res.status(400).json({ message: 'Thiếu hoặc dữ liệu đầu vào không hợp lệ' });
        return  apiResponse(res, 400, null, 'Thiếu hoặc dữ liệu đầu vào không hợp lệ');
    }

    try {
        const db = await dbConnect();

        // Kiểm tra sinh viên có tồn tại không
        const sinhVienCheck = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .query('SELECT 1 FROM sinh_vien WHERE sinh_vien_id = @sinh_vien_id');

        if (sinhVienCheck.recordset.length === 0) {
            // return res.status(404).json({ message: `Sinh viên với ID ${sinh_vien_id} không tồn tại` });
            return apiResponse(res, 404, null, `Sinh viên với ID ${sinh_vien_id} không tồn tại`);
        }

        let lop_hp_id = null;
        const resultMessages = [];

        for (const mon_hoc_id of danh_sach_mon_hoc) {
            // Tìm lớp học phần phù hợp với môn học
            const lopHPResult = await db.request()
                .input('mon_hoc_id', sql.NVarChar, mon_hoc_id)
                .query(`
                    SELECT TOP 1 lop_hp.lop_hp_id
                    FROM lop_hp
                    JOIN mon_hoc_dang_ki ON lop_hp.mh_ki_id = mon_hoc_dang_ki.mh_ki_hoc_id
                    WHERE mon_hoc_dang_ki.mon_hoc_id = @mon_hoc_id
                `);

            if (lopHPResult.recordset.length === 0) {
                resultMessages.push(`Không tìm thấy lớp học phần cho môn học ${mon_hoc_id}.`);
                continue;
            }

            lop_hp_id = lopHPResult.recordset[0].lop_hp_id;

            // Tạo ID mới cho bảng đăng ký
            const newDangKiIdResult = await db.request()
                .query(`
                    SELECT CONCAT('DK', FORMAT(ISNULL(MAX(CAST(SUBSTRING(dang_ki_id, 3, LEN(dang_ki_id) - 2) AS INT)), 0) + 1, '00')) AS new_dang_ki_id
                    FROM dang_ki
                `);

            const new_dang_ki_id = newDangKiIdResult.recordset[0].new_dang_ki_id;

            // Kiểm tra xem sinh viên đã đăng ký lớp học phần này chưa
            const checkExistingQuery = `
                SELECT COUNT(*) AS count
                FROM dang_ki
                WHERE sinh_vien_id = @sinh_vien_id
                AND lop_hp_id = @lop_hp_id
            `;
            const existingCount = await db.request()
                .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
                .input('lop_hp_id', sql.NVarChar, lop_hp_id)
                .query(checkExistingQuery);

            if (existingCount.recordset[0].count > 0) {
                resultMessages.push(`Sinh viên đã đăng ký lớp học phần ${lop_hp_id}.`);
                continue;
            }

            // Chèn vào bảng đăng ký
            await db.request()
                .input('new_dang_ki_id', sql.NVarChar, new_dang_ki_id)
                .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
                .input('lop_hp_id', sql.NVarChar, lop_hp_id)
                .query(`
                    INSERT INTO dang_ki (dang_ki_id, sinh_vien_id, lop_hp_id)
                    VALUES (@new_dang_ki_id, @sinh_vien_id, @lop_hp_id)
                `);

            resultMessages.push(`Đã đăng ký thành công lớp học phần ${lop_hp_id}.`);
        }

        // res.status(201).json({ message: 'Kết quả đăng ký:', results: resultMessages });
        apiResponse(res, 201, resultMessages, 'Kết quả đăng ký');
    } catch (error) {
        console.error('Lỗi khi chèn vào bảng dang_ki:', error);
        // res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký môn học.' });
        apiResponse(res, 500, null, 'Lỗi máy chủ khi đăng ký môn học');
    }
});

// Xoa dang ki
router.delete('/dang_ki', async (req, res) => {
    const { sinh_vien_id, mon_hoc_id } = req.body;

    if (!sinh_vien_id || !mon_hoc_id) {
        return apiResponse(res, 400, null, 'Thiếu thông tin sinh_vien_id hoặc mon_hoc_id');
    }

    try {
        // Kết nối tới cơ sở dữ liệu
        const db = await dbConnect();

        // Xóa bản ghi phụ thuộc trước
        await db.request()
            .input('sinhVienId', sql.NVarChar, sinh_vien_id)
            .input('monHocId', sql.NVarChar, mon_hoc_id)
            .query(`
                DELETE FROM ket_qua
                WHERE dky_id IN (
                    SELECT dk.dang_ki_id
                    FROM dang_ki dk
                    JOIN lop_hp lh ON dk.lop_hp_id = lh.lop_hp_id
                    JOIN mon_hoc_dang_ki mhd ON lh.mh_ki_id = mhd.mh_ki_hoc_id
                    WHERE dk.sinh_vien_id = @sinhVienId AND mhd.mon_hoc_id = @monHocId
                )
            `);

        // Sau đó xóa bản ghi trong `dang_ki`
        const result = await db.request()
            .input('sinhVienId', sql.NVarChar, sinh_vien_id)
            .input('monHocId', sql.NVarChar, mon_hoc_id)
            .query(`
                DELETE FROM dang_ki
                WHERE dang_ki_id IN (
                    SELECT dk.dang_ki_id
                    FROM dang_ki dk
                    JOIN lop_hp lh ON dk.lop_hp_id = lh.lop_hp_id
                    JOIN mon_hoc_dang_ki mhd ON lh.mh_ki_id = mhd.mh_ki_hoc_id
                    WHERE dk.sinh_vien_id = @sinhVienId AND mhd.mon_hoc_id = @monHocId
                )
            `);

        if (result.rowsAffected[0] === 0) {
            return apiResponse(res, 404, null, 'Không tìm thấy lớp học phần đăng ký phù hợp');
        }

        apiResponse(res, 200, null, 'Xóa lớp học phần đã đăng ký thành công');
    } catch (error) {
        console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
        apiResponse(res, 500, null, 'Lỗi server: Không thể xóa lớp học phần');
    }
});

// Cap nhat thong tin dang ki
router.put('/dang_ki', async (req, res) => {
    const { sinh_vien_id, mon_hoc_id_cu, mon_hoc_id_moi } = req.body;

    if (!sinh_vien_id || !mon_hoc_id_cu || !mon_hoc_id_moi) {
        // return apiResponse(res, 400, null, 'Missing sinh_vien_id, mon_hoc_id_cu, or mon_hoc_id_moi in request body');
        return apiResponse(res, 400, null, 'Thieu sinh_vien_id, mon_hoc_id_cu, hoac mon_hoc_id_moi trong yeu cau');
    }

    try {
        const db = await dbConnect();
        const query = `
            UPDATE dk
            SET lop_hp_id = (
                SELECT lh.lop_hp_id
                FROM lop_hp lh
                         JOIN mon_hoc_dang_ki mhd ON lh.mh_ki_id = mhd.mh_ki_hoc_id
                WHERE mhd.mon_hoc_id = @newMonHocId
            )
            FROM dang_ki dk
                     JOIN lop_hp lh ON dk.lop_hp_id = lh.lop_hp_id
                     JOIN mon_hoc_dang_ki mhd ON lh.mh_ki_id = mhd.mh_ki_hoc_id
            WHERE dk.sinh_vien_id = @sinhVienId AND mhd.mon_hoc_id = @oldMonHocId;
        `;

        const result = await db.request()
            .input('sinhVienId', sql.NVarChar, sinh_vien_id)
            .input('oldMonHocId', sql.NVarChar, mon_hoc_id_cu)
            .input('newMonHocId', sql.NVarChar, mon_hoc_id_moi)
            .query(query);

        if (result.rowsAffected === 0) {
            // return apiResponse(res, 404, null, 'No matching course registration found for update');
            return apiResponse(res, 404, null, 'Khong tim thay dang ki mon hoc de cap nhat');
        }

        // apiResponse(res, 200, null, 'Course registration updated successfully');
        apiResponse(res, 200, null, 'Cap nhat dang ki mon hoc thanh cong');
    } catch (error) {
        console.error('Database query error:', error);
        // apiResponse(res, 500, null, 'Server error while updating course registration');
        apiResponse(res, 500, null, 'Loi server khi cap nhat dang ki mon hoc');
    }
});

// lay mon hoc sv da dk
router.get('/mon-hoc-dky/:sinhVienId', async (req, res) => {
    const { sinhVienId } = req.params; // Lấy mã sinh viên từ URL parameters

    try {
        // Kết nối cơ sở dữ liệu
        const db = await dbConnect();

        // Câu truy vấn cập nhật để lấy thêm mã môn học
        const query = `
            SELECT d.dang_ki_id, l.ten_lop, m.ten_mon_hoc, m.mon_hoc_id, k.nam_hoc, k.ki_hoc
            FROM dang_ki d
            JOIN lop_hp l ON d.lop_hp_id = l.lop_hp_id
            JOIN mon_hoc_dang_ki mk ON l.mh_ki_id = mk.mh_ki_hoc_id
            JOIN mon_hoc m ON mk.mon_hoc_id = m.mon_hoc_id
            JOIN ki_hoc k ON mk.ki_hoc_id = k.ki_hoc_id
            WHERE d.sinh_vien_id = @sinhVienId;
        `;

        // Chạy truy vấn với tham số động
        const result = await db.request()
            .input('sinhVienId', sql.NVarChar, sinhVienId)
            .query(query);

        // Xử lý kết quả trả về
        if (result.recordset.length === 0) {
            apiResponse(res, 404, null, 'Không tìm thấy môn học cho sinh viên');
        } else {
            apiResponse(res, 200, result.recordset, 'Danh sách môn học sinh viên đã đăng ký');
        }

    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy dữ liệu môn học đã đăng ký');
    }
});

// lay thoi khoa bieu
router.get('/thoi-khoa-bieu/:sinh_vien_id', async (req, res) => {
    const { sinh_vien_id } = req.params; // Lấy `sinh_vien_id` từ tham số URL

    try {
        // Kết nối với cơ sở dữ liệu
        const db = await dbConnect();

        // Thực hiện truy vấn lấy thời khóa biểu
        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .query(`
                SELECT 
                    m.ten_mon_hoc, 
                    l.ten_lop, 
                    tkb.ngay, 
                    tkb.kip, 
                    ph.ten_phong, 
                    t.ten AS ten_toa_nha
                FROM 
                    dang_ki dk
                JOIN 
                    lop_hp l ON dk.lop_hp_id = l.lop_hp_id
                JOIN 
                    mon_hoc_dang_ki mhd ON l.mh_ki_id = mhd.mh_ki_hoc_id
                JOIN 
                    mon_hoc m ON mhd.mon_hoc_id = m.mon_hoc_id
                JOIN 
                    thoi_khoa_bieu tkb ON l.lop_hp_id = tkb.lop_hp_id
                JOIN 
                    phong_hoc ph ON tkb.phong_hoc_id = ph.phong_hoc_id
                JOIN 
                    toa_nha t ON ph.toa_nha_id = t.toa_nha_id
                WHERE 
                    dk.sinh_vien_id = @sinh_vien_id
            `);

        // Nếu không tìm thấy dữ liệu
        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Thời khóa biểu không tìm thấy.');
        }

        // Trả về dữ liệu thời khóa biểu
        apiResponse(res, 200, result.recordset, 'Lấy thời khóa biểu thành công.');

    } catch (error) {
        // Xử lý lỗi truy vấn
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

        // Kiểm tra sinh viên có tồn tại không
        const sinhVienCheck = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .query('SELECT 1 FROM sinh_vien WHERE sinh_vien_id = @sinh_vien_id');

        if (sinhVienCheck.recordset.length === 0) {
            return apiResponse(res, 404, null, `Sinh viên với ID ${sinh_vien_id} không tồn tại`);
        }

        // Truy vấn lấy điểm của sinh viên theo các môn đã đăng ký
        const results = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .query(`
                SELECT m.ten_mon_hoc, k.diem, dd.ten_dau_diem
                FROM ket_qua k
                JOIN dau_diem_mon_hoc ddmh ON k.dau_diemmh_id = ddmh.diem_mh_id
                JOIN mon_hoc m ON ddmh.mon_hoc_id = m.mon_hoc_id
                JOIN dau_diem dd ON ddmh.dau_diem_id = dd.dau_diem_id
                WHERE k.dky_id IN (
                    SELECT dang_ki_id
                    FROM dang_ki
                    WHERE sinh_vien_id = @sinh_vien_id
                )
            `);

        if (results.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Không có điểm để hiển thị cho sinh viên này.');
        }

        const groupedScores = results.recordset.reduce((acc, item) => {
            // Nếu môn học chưa có trong acc, thêm nó
            if (!acc[item.ten_mon_hoc]) {
                acc[item.ten_mon_hoc] = [];
            }
            // Thêm điểm của môn học vào danh sách
            acc[item.ten_mon_hoc].push({
                diem: item.diem,
                ten_dau_diem: item.ten_dau_diem
            });
            return acc;
        }, {});

        // Tạo một mảng từ đối tượng để phản hồi
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
        const query = `
            SELECT 
                kq.diem,
                mh.ten_mon_hoc
            FROM 
                ket_qua kq
                JOIN dang_ki dk ON kq.dky_id = dk.dang_ki_id
                JOIN lop_hp lhp ON dk.lop_hp_id = lhp.lop_hp_id
                JOIN mon_hoc_dang_ki mhdk ON lhp.mh_ki_id = mhdk.mh_ki_hoc_id
                JOIN mon_hoc mh ON mhdk.mon_hoc_id = mh.mon_hoc_id
                JOIN ki_hoc kh ON mhdk.ki_hoc_id = kh.ki_hoc_id
            WHERE 
                dk.sinh_vien_id = @sinh_vien_id
                AND kh.ki_hoc = @ki_hoc`;

        const result = await db.request()
            .input('sinh_vien_id', sql.NVarChar, sinh_vien_id)
            .input('ki_hoc', sql.NVarChar, ki_hoc)
            .query(query);

        if (result.recordset.length === 0) {
            apiResponse(res, 404, null, 'Không tìm thấy điểm cho sinh viên trong kỳ học đã chỉ định');
        } else {
            apiResponse(res, 200, result.recordset, 'Điểm của sinh viên');
        }
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Lỗi khi lấy dữ liệu điểm của sinh viên');
    }
});
module.exports = router;
