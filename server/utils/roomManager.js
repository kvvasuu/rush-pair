export const rooms = new Map();

export const getAvailableRooms = () => {
  return Array.from(rooms, ([key, value]) => ({
    roomName: key,
    users: value.users.length,
  }));
};

export const removeUserFromRoom = (roomName, userId) => {
  if (rooms.has(roomName)) {
    const users = rooms.get(roomName).users;
    rooms.set(
      roomName,
      users.filter((user) => user.userId !== userId)
    );
  }
};
