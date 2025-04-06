const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload.single("image"); // 단일 이미지 업로드 미들웨어
