const express = require('express');
const router = require('./src/routes/apiRouter');
const app = express();
const port = process.env.PORT || 3000; // Sử dụng giá trị PORT từ .env, nếu không có sẽ dùng 3000 làm mặc định

// Middleware để phân tích cú pháp JSON
app.use(express.json());


app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
