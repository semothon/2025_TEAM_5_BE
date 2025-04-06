const express = require('express')
const router = express.Router();
const googlelogin_controller = require('../controller/googlelogin.controller')
const getinfo_controller = require('../controller/getinfo.controller')
const authMiddleware = require('../middleware/tokenverify')
const updateinfo_controller = require('../controller/updateinfo.controller')
const getmailbox_controller = require('../controller/getmailbox.controller')
const addfriend_controller = require('../controller/addfriend.controller')
const uploadimg_controller = require('../controller/uploadimg.controller')
const searchfriend_controller = require('../controller/searchfriend.controller')
const getfriendreq_controller = require('../controller/getfriendreq.controller')
const friendaccept_controller = require('../controller/friendaccept.controller')
const multer = require('../middleware/multer')
const getfriendlist_controller = require('../controller/getfriendlist.controller');
const getmyinfo_controller = require('../controller/getmyinfo.controller');
const getworldcup_controller = require('../controller/getworldcup.controller')


//구글로그인 API
router.get('/googlelogin', googlelogin_controller.googlelogin)
router.get('/googlelogin/callback', googlelogin_controller.googlelogin_callback)


//회원정보 API
router.post('/getinfo', authMiddleware, getinfo_controller.getinfo)

//내정보 API
router.get('/getmyinfo', authMiddleware, getmyinfo_controller.getmyinfo)


//회원정보수정 API
router.post('/updateinfo', authMiddleware, updateinfo_controller.updateinfo)



//추파함조회
router.get('/getmailbox', authMiddleware, getmailbox_controller.getmailbox)

//친구추가
router.post('/addfriend', authMiddleware, addfriend_controller.addfriend)

//친구목록조회
router.get('/getfriendlist', authMiddleware, getfriendlist_controller.getfriendlist)

//친구검색
router.post('/searchfriend', authMiddleware, searchfriend_controller.searchfriend)

//친구요청목록조회
router.post('/getfriendreq', authMiddleware, getfriendreq_controller.getfriendreq)

//친구요청수락
router.post('/friendaccept', authMiddleware, friendaccept_controller.friendaccept)

//월드컵 참가 인원 무작위 뽑기  
router.post('/getworldcup', authMiddleware, getworldcup_controller.getRandomWorldcupUsers)


//이미지 업로드
router.post("/uploadimg", authMiddleware, multer, uploadimg_controller.uploadimg)



module.exports = router