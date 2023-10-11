import { UserAndRoom, RoomData, UserSocket } from "./model";
import * as dao from "./database/dao";

export const getSupervisorOfRoom = async (roomId: number) => {
    const result = await dao.getSupervisorOfRoom(roomId);
    return result;
}

export const getSocketIdFromUserId= async (roomId: number, userId: number) => {
    const result = await dao.getSocketIdFromUserId(roomId, userId);
    return result[0].socket_id;
}


export const joinRoom= (roomId: number, userId: number, socketId: string) => {
    return dao.joinRoom(roomId, userId, socketId);
}

export const leaveRoom= (roomId: number, userId: number) => {
    return dao.leaveRoom(roomId, userId);
}

export const getAllStartDateAndEndDateOfExam = async () => {
    return dao.getAllStartDateAndEndDateOfExam(); 
}

export const getUserInfo = async (userId: number) => {
    return dao.getUserInfo(userId);
}

export const getSupervisorAndRoomFromUserSocket = async (socketId: string) => {
    return dao.getSupervisorAndRoomFromUserSocket(socketId);
}

export const getUserAndRoomFromSocket = async (socketId: string) => {
    return dao.getUserAndRoomFromSocket(socketId);
}
