/* export const rooms = new Map(); */

export const rooms = new Map([
  ["1dsa", { users: [1, 2, 4, 5] }],
  ["3sdasd", { users: [1, 2, 4, 5, 2, 4, 5, 6] }],
  ["4dsa", { users: [1, 2, 5] }],
  ["daa", { users: [1, 2, 4, 5, 2, 4, 5, 6, 7, 1, 2, 3, 4, 5] }],
  ["3szzadasd", { users: [] }],
  ["4dsada", { users: [] }],
  ["dsasa", { users: [] }],
  ["3sxzdasd", { users: [] }],
  ["4daasa", { users: [] }],
]);

export const getAvailableRooms = () => {
  if (rooms.size > 0) {
    return Array.from(rooms, ([key, value]) => ({
      roomId: key,
      roomName: value.roomName,
      users: value.users.length,
    }));
  } else return [];
};

export const removeUserFromRoom = (roomId, userId) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    const users = rooms.get(roomId).users;
    rooms.set(roomId, {
      ...room,
      users: users.filter((user) => user.userId !== userId),
    });
  }
};
