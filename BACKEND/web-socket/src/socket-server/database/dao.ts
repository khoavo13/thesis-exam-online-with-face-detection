import { db } from "./connection";

export const getSupervisorOfRoom  = async (roomId: number) => {
    return await db.query(`SELECT ur.user_id
                            FROM user_room ur JOIN users u ON ur.user_id = u.id 
                            WHERE ur.room_id = $1 AND u.role = 1`, [roomId])
}

export const getSocketIdFromUserId = async (roomId: number, userId: number) => {
    return await db.query('SELECT socket_id FROM user_room WHERE room_id = $1 AND user_id = $2', [roomId, userId])
}

export const joinRoom = async (roomId: number, userId: number, socketId: string) => {
    console.log(`User ${userId} join room ${roomId}`);
    return await db.query('UPDATE user_room SET socket_id = $1 WHERE room_id = $2 AND user_id = $3 ', [socketId, roomId, userId])
}

export const leaveRoom = async (roomId: number, userId: number) => {
    return await db.query('UPDATE user_room SET socket_id = NULL WHERE room_id = $1 AND user_id = $2 ', [roomId, userId])
}

export const getAllStartDateAndEndDateOfExam = async () => {
    return await db.query('SELECT id, start_date, end_date FROM exam');
}

export const getUserInfo = async (userId: number) => {
    return await db.query(`SELECT full_name, user_number FROM users WHERE id=$1`, [userId]);
}

export const getSupervisorAndRoomFromUserSocket = async (socketId: string) => {
    return await db.query(`SELECT ur.user_id, ur.room_id
    FROM user_room ur JOIN users u ON ur.user_id = u.id 
    WHERE u.role = 1 
        AND ur.room_id in (select room_id from user_room where socket_id=$1)`, [socketId]);
}

export const getUserAndRoomFromSocket = async (socketId: string) => {
    return await db.query(`select room_id, user_id from user_room where socket_id=$1`, [socketId]);
}
