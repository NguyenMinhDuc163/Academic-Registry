const express = require("express");
const sql = require('mssql');
const dbConnect = require("../configs/db.config");
const apiResponse = require("../utils/responseHelper"); // Đảm bảo đường dẫn này chính xác
const router = express.Router();

//http://localhost:3000/api/v1

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await dbConnect();
        const userResult = await db.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT tai_khoan_id, username, password, full_name, birth, email, ten_khoa, vai_tro FROM tai_khoan WHERE username = @username');

        if (userResult.recordset.length === 0) {
            return apiResponse(res, 404, null, 'User not found');
        }

        const user = userResult.recordset[0];
        if (user.password !== password) {
            return apiResponse(res, 401, null, 'Incorrect password');
        }

        apiResponse(res, 200, user, 'Logged in successfully');
    } catch (error) {
        console.error(error);
        apiResponse(res, 500, null, 'Failed to login due to server error');
    }
});

// lay khoa
router.get('/get_khoa/:khoaId', async (req, res) => {
    const { khoaId } = req.params; // Get khoaId from URL parameter

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('khoaId', sql.NVarChar, khoaId)
            .query('SELECT khoa_id, ten_khoa, mota FROM khoa WHERE khoa_id = @khoaId');

        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Khoa not found');
        }

        const khoaInfo = result.recordset[0];
        apiResponse(res, 200, khoaInfo, 'Khoa information retrieved successfully');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Failed to retrieve khoa due to server error');
    }
});


// sinh vien
router.get('/get_sinh_vien/:sinhVienId', async (req, res) => {
    const { sinhVienId } = req.params; // Receive sinhVienId from URL parameter

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('sinhVienId', sql.NVarChar, sinhVienId.toLowerCase())
            .query('SELECT sinh_vien_id, tai_khoan_id, khoa_id FROM sinh_vien WHERE sinh_vien_id = @sinhVienId');

        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Sinh viên not found');
        }

        const sinhVienInfo = result.recordset[0];
        apiResponse(res, 200, sinhVienInfo, 'Sinh viên information retrieved successfully');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Failed to retrieve sinh viên due to server error');
    }
});


// giang vien
router.get('/get-giang-vien/:giangVienId', async (req, res) => {
    const { giangVienId } = req.params; // Nhận giangVienId từ URL parameter

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('giangVienId', sql.NVarChar, giangVienId)
            .query('SELECT giang_vien_id, bo_mon_id, tai_khoan_id FROM giang_vien WHERE giang_vien_id = @giangVienId');

        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Giảng viên not found');
        }

        const giangVienInfo = result.recordset[0];
        apiResponse(res, 200, giangVienInfo, 'Giảng viên information retrieved successfully');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Failed to retrieve giảng viên due to server error');
    }
});

// bo mon
router.get('/bo-mon/:boMonId', async (req, res) => {
    const { boMonId } = req.params; // Retrieve boMonId from URL parameters

    try {
        const db = await dbConnect();
        const result = await db.request()
            .input('boMonId', sql.NVarChar, boMonId)
            .query('SELECT bo_mon_id, ten_bo_mon, khoa_id FROM bo_mon WHERE bo_mon_id = @boMonId');

        if (result.recordset.length === 0) {
            return apiResponse(res, 404, null, 'Bộ môn not found');
        }

        const boMonInfo = result.recordset[0];
        apiResponse(res, 200, boMonInfo, 'Bộ môn information retrieved successfully');
    } catch (error) {
        console.error('Database query error:', error);
        apiResponse(res, 500, null, 'Failed to retrieve bộ môn due to server error');
    }
});

// mon hoc
router.get('/mon-hoc/:monHocId', async (req, res) => {
    const { monHocId } = req.params;  // Get course ID from URL parameters

    try {
        const db = await dbConnect();
        const query = `
            SELECT mon_hoc_id, so_tc, ten_mon_hoc, bo_mon_id 
            FROM mon_hoc 
            WHERE mon_hoc_id = @monHocId`;
        const result = await db.request()
            .input('monHocId', sql.NVarChar, monHocId)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Course not found' });
        } else {
            res.status(200).json(result.recordset[0]);
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Failed to retrieve course due to server error' });
    }
});

// phong hoc
router.get('/phong-hoc/:phongHocId', async (req, res) => {
    const { phongHocId } = req.params;  // Lấy ID phòng học từ URL parameters
        console.log(phongHocId)
    try {
        const db = await dbConnect();
        const query = `
            SELECT phong_hoc_id, ten_phong, si_so_max, toa_nha_id
            FROM phong_hoc 
            WHERE phong_hoc_id = @phongHocId`;
        const result = await db.request()
            .input('phongHocId', sql.NVarChar, phongHocId)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Phòng học not found' });
        } else {
            res.status(200).json(result.recordset[0]);
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Failed to retrieve phòng học due to server error' });
    }
});


router.get('/toa-nha/:toaNhaId', async (req, res) => {
    const { toaNhaId } = req.params; // Lấy ID tòa nhà từ URL parameters

    try {
        const db = await dbConnect();
        const query = `
            SELECT toa_nha_id, ten
            FROM toa_nha
            WHERE toa_nha_id = @toaNhaId`;
        const result = await db.request()
            .input('toaNhaId', sql.NVarChar, toaNhaId)
            .query(query);

        if (result.recordset.length === 0) {
            res.status(404).json({ message: 'Tòa nhà not found' });
        } else {
            res.status(200).json(result.recordset[0]);
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Failed to retrieve tòa nhà due to server error' });
    }
});
module.exports = router;
