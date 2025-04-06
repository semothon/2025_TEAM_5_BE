const mongoose = require('mongoose')
const Friendlist = require('../models/friendlist_model')

/**
 * 친구 목록에서 이름으로 검색하는 기능
 * @param {Object} req - 요청 객체
 * @returns {Object} 검색 결과
 */
exports.searchFriends = async (req) => {
    const { searchName } = req.body
    const currentUserEmail = req.user.email

    try {
        // 검색어가 비어있는 경우
        if (!searchName || searchName.trim() === '') {
            return { success: false, message: "검색어없음" }
        }

        // 현재 사용자의 친구 목록 가져오기
        const friendlist = await Friendlist.findOne({ useremail: currentUserEmail })

        // 친구 목록이 없는 경우
        if (!friendlist || !friendlist.friends || friendlist.friends.length === 0) {
            return { success: false, message: "친구목록없음" }
        }

        // 이름에 검색어가 포함된 친구들 필터링
        const searchRegex = new RegExp(searchName, 'i') // 대소문자 구분 없이 검색
        const searchResults = friendlist.friends.filter(friend =>
            searchRegex.test(friend.name)
        )

        // 검색 결과가 없는 경우
        if (searchResults.length === 0) {
            return { success: false, message: "검색결과없음" }
        }

        return {
            success: true,
            message: "검색 성공",
            data: searchResults
        }
    } catch (err) {
        return { success: false, message: `검색 실패: ${err.message}` }
    }
}