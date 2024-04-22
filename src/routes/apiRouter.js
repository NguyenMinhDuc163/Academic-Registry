const express = require("express");
const dbConnect = require("../configs/db.congig");
const router = express.Router();

// 1. Lấy danh sách các khoá học có sẵn
router.get('/courses', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('SELECT khoa_id, ten_khoa, mota FROM khoa');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 2. Lấy danh sách môn học theo khoa
router.get('/subjects/:khoaId', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('SELECT m.mon_hoc_id, m.ten_mon_hoc, m.so_tc, b.ten_bo_mon FROM mon_hoc m JOIN bo_mon b ON m.bo_mon_id = b.bo_mon_id WHERE b.khoa_id = ?', [req.params.khoaId]);
        res.json(result.recordset);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 3. Lấy danh sách các lớp học phần mở cho đăng ký
router.get('/class-registrations', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('SELECT l.lop_hp_id, l.ten_lop, l.si_so, m.ten_mon_hoc, k.nam_hoc, k.ki_hoc FROM lop_hp l JOIN mon_hoc_dang_ki mk ON l.mh_ki_id = mk.mh_ki_hoc_id JOIN mon_hoc m ON mk.mon_hoc_id = m.mon_hoc_id JOIN ki_hoc k ON mk.ki_hoc_id = k.ki_hoc_id');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 4. Đăng ký một lớp học phần cho sinh viên
router.post('/register-class', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('INSERT INTO dang_ki (dang_ki_id, sinh_vien_id, lop_hp_id) VALUES (?, ?, ?)', [req.body.dang_ki_id, req.body.sinh_vien_id, req.body.lop_hp_id]);
        res.json({ message: 'Registration successful', data: result.recordset });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 5. Xem danh sách các lớp học phần mà sinh viên đã đăng ký
router.get('/registrations/:sinhVienId', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('SELECT d.dang_ki_id, l.ten_lop, m.ten_mon_hoc, k.nam_hoc, k.ki_hoc FROM dang_ki d JOIN lop_hp l ON d.lop_hp_id = l.lop_hp_id JOIN mon_hoc_dang_ki mk ON l.mh_ki_id = mk.mh_ki_hoc_id JOIN mon_hoc m ON mk.mon_hoc_id = m.mon_hoc_id JOIN ki_hoc k ON mk.ki_hoc_id = k.ki_hoc_id WHERE d.sinh_vien_id = ?', [req.params.sinhVienId]);
        res.json(result.recordset);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 6. Xoá đăng ký một lớp học phần
router.delete('/unregister-class/:dangKiId', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('DELETE FROM dang_ki WHERE dang_ki_id = ?', [req.params.dangKiId]);
        res.json({ message: 'Registration deleted', data: result.recordset });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 7. Cập nhật thông tin đăng ký
router.put('/update-registration/:dangKiId', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('UPDATE dang_ki SET lop_hp_id = ? WHERE dang_ki_id = ?', [req.body.lop_hp_id, req.params.dangKiId]);
        res.json({ message: 'Registration updated', data: result.recordset });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

// 8. Xem điểm của sinh viên theo các môn đã đăng ký
router.get('/student-grades/:sinhVienId', async (req, res) => {
    try {
        const db = await dbConnect();
        const result = await db.query('SELECT m.ten_mon_hoc, k.diem, dd.ten_dau_diem FROM ket_qua k JOIN dau_diem_mon_hoc ddmh ON k.dau_diemmh_id = ddmh.diem_mh_id JOIN mon_hoc m ON ddmh.mon_hoc_id = m.mon_hoc_id JOIN dau_diem dd ON ddmh.dau_diem_id = dd.dau_diem_id WHERE k.dky_id IN (SELECT dang_ki_id FROM dang_ki WHERE sinh_vien_id = ?)', [req.params.sinhVienId]);
        res.json(result.recordset);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error querying the database');
    }
});

//DELETE
router.delete('/delete-all', async (req, res) => {
    try {
        const db = await dbConnect();
        await db.beginTransaction();
        const queries = `
            DELETE FROM thoi_khoa_bieu;
            DELETE FROM ket_qua;
            DELETE FROM dang_ki;
            DELETE FROM dau_diem_mon_hoc;
            DELETE FROM lop_hp;
            DELETE FROM mon_hoc_dang_ki;
            DELETE FROM mon_hoc;
            DELETE FROM giang_vien;
            DELETE FROM bo_mon;
            DELETE FROM phong_hoc;
            DELETE FROM sinh_vien;
            DELETE FROM khoa;
            DELETE FROM tai_khoan;
            DELETE FROM toa_nha;
            DELETE FROM dau_diem;
            DELETE FROM ki_hoc;
        `;
        await db.query(queries);
        await db.commit();
        res.send('All data deleted successfully');
    } catch (error) {
        await db.rollback();
        console.error('Database query error:', error);
        res.status(500).send('Error occurred, transaction rolled back');
    }
});


module.exports = router;