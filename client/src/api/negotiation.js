import api from "./axios";

export const fetchMyRooms = () => api.get("/negotiation/rooms/");
export const fetchRoom = (roomId) => api.get(`/negotiation/rooms/${roomId}/`);
