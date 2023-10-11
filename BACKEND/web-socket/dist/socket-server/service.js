"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dao = __importStar(require("./database/dao"));
const getSupervisorOfRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dao.getSupervisorOfRoom(roomId);
    return result;
});
exports.getSupervisorOfRoom = getSupervisorOfRoom;
const getSocketIdFromUserId = (roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dao.getSocketIdFromUserId(roomId, userId);
    return result[0].socket_id;
});
exports.getSocketIdFromUserId = getSocketIdFromUserId;
const joinRoom = (roomId, userId, socketId) => {
    return dao.joinRoom(roomId, userId, socketId);
};
exports.joinRoom = joinRoom;
const leaveRoom = (roomId, userId) => {
    return dao.leaveRoom(roomId, userId);
};
exports.leaveRoom = leaveRoom;
const getAllStartDateAndEndDateOfExam = () => __awaiter(void 0, void 0, void 0, function* () {
    return dao.getAllStartDateAndEndDateOfExam();
});
exports.getAllStartDateAndEndDateOfExam = getAllStartDateAndEndDateOfExam;
const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return dao.getUserInfo(userId);
});
exports.getUserInfo = getUserInfo;
const getSupervisorAndRoomFromUserSocket = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    return dao.getSupervisorAndRoomFromUserSocket(socketId);
});
exports.getSupervisorAndRoomFromUserSocket = getSupervisorAndRoomFromUserSocket;
const getUserAndRoomFromSocket = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    return dao.getUserAndRoomFromSocket(socketId);
});
exports.getUserAndRoomFromSocket = getUserAndRoomFromSocket;
//# sourceMappingURL=service.js.map