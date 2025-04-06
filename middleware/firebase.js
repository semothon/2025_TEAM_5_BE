require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../picknpick-3932d-firebase-adminsdk-fbsvc-95c09039f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});

const bucket = admin.storage().bucket();

module.exports = bucket;
