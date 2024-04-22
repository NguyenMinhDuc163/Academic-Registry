const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    database: 'dkytin',
    user: 'root', // username của kết nối mysql
    password: 'NguyenDuc@163' ,// password của kết nối mysql
    multipleStatements: true
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + db.threadId);
});

// 1. Lấy danh sách các khoá học có sẵn
app.get('/courses', (req, res) => {
    db.query('SELECT khoa_id, ten_khoa, mota FROM khoa', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// 2. Lấy danh sách môn học theo khoa
app.get('/subjects/:khoaId', (req, res) => {
    const khoaId = req.params.khoaId;
    db.query('SELECT m.mon_hoc_id, m.ten_mon_hoc, m.so_tc, b.ten_bo_mon FROM mon_hoc m JOIN bo_mon b ON m.bo_mon_id = b.bo_mon_id WHERE b.khoa_id = ?', [khoaId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// 3. Lấy danh sách các lớp học phần mở cho đăng ký
app.get('/class-registrations', (req, res) => {
    db.query('SELECT l.lop_hp_id, l.ten_lop, l.si_so, m.ten_mon_hoc, k.nam_hoc, k.ki_hoc FROM lop_hp l JOIN mon_hoc_dang_ki mk ON l.mh_ki_id = mk.mh_ki_hoc_id JOIN mon_hoc m ON mk.mon_hoc_id = m.mon_hoc_id JOIN ki_hoc k ON mk.ki_hoc_id = k.ki_hoc_id', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// 4. Đăng ký một lớp học phần cho sinh viên
app.post('/register-class', (req, res) => {
    const { dang_ki_id, sinh_vien_id, lop_hp_id } = req.body;
    const sql = 'INSERT INTO dang_ki (dang_ki_id, sinh_vien_id, lop_hp_id) VALUES (?, ?, ?)';
    db.query(sql, [dang_ki_id, sinh_vien_id, lop_hp_id], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Registration successful', data: results });
    });
});

// 5. Xem danh sách các lớp học phần mà sinh viên đã đăng ký
app.get('/registrations/:sinhVienId', (req, res) => {
    const sinhVienId = req.params.sinhVienId;
    db.query('SELECT d.dang_ki_id, l.ten_lop, m.ten_mon_hoc, k.nam_hoc, k.ki_hoc FROM dang_ki d JOIN lop_hp l ON d.lop_hp_id = l.lop_hp_id JOIN mon_hoc_dang_ki mk ON l.mh_ki_id = mk.mh_ki_hoc_id JOIN mon_hoc m ON mk.mon_hoc_id = m.mon_hoc_id JOIN ki_hoc k ON mk.ki_hoc_id = k.ki_hoc_id WHERE d.sinh_vien_id = ?', [sinhVienId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// 6. Xoá đăng ký một lớp học phần
app.delete('/unregister-class/:dangKiId', (req, res) => {
    const dangKiId = req.params.dangKiId;
    db.query('DELETE FROM dang_ki WHERE dang_ki_id = ?', [dangKiId], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Registration deleted', data: results });
    });
});

// 7. Cập nhật thông tin đăng ký
app.put('/update-registration/:dangKiId', (req, res) => {
    const { lop_hp_id } = req.body;
    const dangKiId = req.params.dangKiId;
    db.query('UPDATE dang_ki SET lop_hp_id = ? WHERE dang_ki_id = ?', [lop_hp_id, dangKiId], (error, results) => {
        if (error) throw error;
        res.json({ message: 'Registration updated', data: results });
    });
});

// 8. Xem điểm của sinh viên theo các môn đã đăng ký
app.get('/student-grades/:sinhVienId', (req, res) => {
    const sinhVienId = req.params.sinhVienId;
    db.query('SELECT m.ten_mon_hoc, k.diem, dd.ten_dau_diem FROM ket_qua k JOIN dau_diem_mon_hoc ddmh ON k.dau_diemmh_id = ddmh.diem_mh_id JOIN mon_hoc m ON ddmh.mon_hoc_id = m.mon_hoc_id JOIN dau_diem dd ON ddmh.dau_diem_id = dd.dau_diem_id WHERE k.dky_id IN (SELECT dang_ki_id FROM dang_ki WHERE sinh_vien_id = ?)', [sinhVienId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//DELETE
app.delete('/delete-all', (req, res) => {
    // Start a transaction to ensure all deletes are successful
    db.beginTransaction(err => {
        if (err) return res.status(500).send('Error starting transaction');

        // Delete from dependent tables first
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

        db.query(queries, (error, results) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).send('Error occurred, transaction rolled back');
                    throw error;
                });
            }

            // Commit the transaction
            db.commit(err => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).send('Error committing transaction');
                        throw err;
                    });
                }
                res.send('All data deleted successfully');
            });
        });
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
