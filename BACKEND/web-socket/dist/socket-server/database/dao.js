"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAndRoomFromSocket = exports.getSupervisorAndRoomFromUserSocket = exports.getUserInfo = exports.getAllStartDateAndEndDateOfExam = exports.leaveRoom = exports.joinRoom = exports.getSocketIdFromUserId = exports.getSupervisorOfRoom = void 0;
const connection_1 = require("./connection");
const getSupervisorOfRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query(`SELECT ur.user_id
                            FROM user_room ur JOIN users u ON ur.user_id = u.id 
                            WHERE ur.room_id = $1 AND u.role = 1`, [roomId]);
});
exports.getSupervisorOfRoom = getSupervisorOfRoom;
const getSocketIdFromUserId = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query('SELECT socket_id FROM user_room WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
});
exports.getSocketIdFromUserId = getSocketIdFromUserId;
const joinRoom = (roomId, userId, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`User ${userId} join room ${roomId}`);
    return yield connection_1.db.query('UPDATE user_room SET socket_id = $1 WHERE room_id = $2 AND user_id = $3 ', [socketId, roomId, userId]);
});
exports.joinRoom = joinRoom;
const leaveRoom = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query('UPDATE user_room SET socket_id = NULL WHERE room_id = $1 AND user_id = $2 ', [roomId, userId]);
});
exports.leaveRoom = leaveRoom;
const getAllStartDateAndEndDateOfExam = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query('SELECT id, start_date, end_date FROM exam');
});
exports.getAllStartDateAndEndDateOfExam = getAllStartDateAndEndDateOfExam;
const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query(`SELECT full_name, user_number FROM users WHERE id=$1`, [userId]);
});
exports.getUserInfo = getUserInfo;
const getSupervisorAndRoomFromUserSocket = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query(`SELECT ur.user_id, ur.room_id
    FROM user_room ur JOIN users u ON ur.user_id = u.id 
    WHERE u.role = 1 
        AND ur.room_id in (select room_id from user_room where socket_id=$1)`, [socketId]);
});
exports.getSupervisorAndRoomFromUserSocket = getSupervisorAndRoomFromUserSocket;
const getUserAndRoomFromSocket = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield connection_1.db.query(`select room_id, user_id from user_room where socket_id=$1`, [socketId]);
});
exports.getUserAndRoomFromSocket = getUserAndRoomFromSocket;
//# sourceMappingURL=dao.js.map