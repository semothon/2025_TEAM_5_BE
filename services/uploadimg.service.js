const { v4: uuidv4 } = require("uuid");
const bucket = require("../middleware/firebase");
const User = require('../models/user_model.js');

exports.uploadimg = async (req,res)=>{
    try {
        const file = req.file;
        const userId = req.user.email; // tokenverify 통해 추출
    
        const fileName = `profileImages/${userId}_${uuidv4()}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
    
        blobStream.on("error", (err) => {
          console.error(err);
          return res.status(500).send("업로드 실패");
        });
    
        blobStream.on("finish", async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
          await User.updateOne(
            { email: req.user.email },                    // 조건
            { $set: { profileImage: publicUrl } } // 업데이트할 필드
          );
          res.send({ imageUrl: publicUrl });
        });
    
        blobStream.end(file.buffer);
      } catch (err) {
        console.error(err);
        res.status(500).send("서버 오류");
      }
}