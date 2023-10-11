export interface UserSocket {
    id: number,
    socketId: string
}
  
export interface RoomData {
    id: number,
    users: UserSocket[]
}
  
export interface UserAndRoom {
    roomId: number,
    userId: number
}

export interface UnusualAction {
  type: string,
  description: string,
  occurAt: Date,
  roomId: number,
  userId: number
}