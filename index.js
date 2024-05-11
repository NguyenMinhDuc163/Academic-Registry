const express = require('express');
const router = require('./src/routes/apiRouter');
const app = express();
const port = process.env.PORT || 3000; // Sử dụng giá trị PORT từ .env, nếu không có sẽ dùng 3000 làm mặc định
const cors = require("cors")
// Middleware để phân tích cú pháp JSON
app.use(express.json());
app.use(cors())

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
