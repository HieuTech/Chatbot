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

  socket.on("chat message", function (data) {
    displayMessage(messages, data,socket.id);
    typingIndicator.textContent ="";
  });

  socket.on("typing", function () {
    showTypingIndicator(typingIndicator);
  });
  socket.on("stop-typing", function () {
    typingIndicator.textContent = "";
  });
});

function sendMessage(socket, input, typingIndicator) {
  if (input.value) {
    socket.emit("chat message", input.value);
  }
  input.value = "";
  typingIndicator.textContent = "";
}

function indicateTyping(socket) {
  socket.emit("typing");
}

function displayMessage(messages, data, currentSocketId) {
  if (!data || !data.userAvatar || !data.msg) {
    console.error("Invalid data format");
    return;
  }

  const item = document.createElement("li");
  const paragraph = document.createElement("p"); 

  if (data.sender === currentSocketId) {
    item.classList.add("message-sender");
    paragraph.classList.add('desc-sender');
  } else {
    item.classList.add("message-receiver");
    paragraph.classList.add('desc-receiver');
  }
  const avatar = document.createElement("img");
  avatar.src = `/avatars/${data.userAvatar}`;
  avatar.alt = "User Avatar";

  item.appendChild(avatar);
  item.appendChild(paragraph)
  paragraph.appendChild(document.createTextNode(data.msg));
  // item.appendChild(document.createTextNode(data.msg));

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

function showTypingIndicator(typingIndicator) {
  typingIndicator.textContent = "Someone is typing...";
}
