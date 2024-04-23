// utils/responseHelper.js

function apiResponse(res, status, data, message) {
    res.status(status).json({
        responseCode: status,
        object: data,
        message: message
    });
}

module.exports = apiResponse;
