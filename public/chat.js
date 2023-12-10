let socket; // Khai báo biến `socket` ở phạm vi toàn cục

document.addEventListener("DOMContentLoaded", function () {
  socket = io(); // Khởi tạo `socket`
  const input = document.getElementById("input");
  const form = document.getElementById("form");
  const messages = document.getElementById("messages");
  const typingIndicator = document.getElementById("typing-indicator");

  form.onsubmit = function (e) {
    e.preventDefault();
    sendMessage(socket, input, typingIndicator);
  };

  input.oninput = function () {
    indicateTyping(socket);
  };

  socket.on("chat message", function (msg) {
    displayMessage(msg, messages);
  });

  socket.on("typing", function () {
    showTypingIndicator(typingIndicator);
  });
});

function sendMessage(socket, input, typingIndicator) {
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
    typingIndicator.textContent = "...";
  }
}

function indicateTyping(socket) {
  socket.emit("typing");
}

function displayMessage(msg, messages) {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

function showTypingIndicator(typingIndicator) {
  typingIndicator.textContent = "Someone is typing...";
}
