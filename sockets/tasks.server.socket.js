// Create the chat configuration
module.exports = (io, socket) => {
  socket.join('tasks');
};
