const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const typingIndicator = document.getElementById("typing-indicator");
const themeToggle = document.getElementById("toggle-theme");
const body = document.body;

let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
let nightMode = localStorage.getItem("nightMode") === "true";

// Apply saved theme
if (nightMode) {
  body.classList.add("night");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

// Load old messages
messages.forEach(msg => addMessage(msg.text, msg.type, msg.time, false));

// Utility functions
function addMessage(text, type, time, scroll = true) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.innerHTML = `${text}<div class="timestamp">${time}</div>`;
  chatBox.appendChild(msgDiv);
  if (scroll) chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessage(text, type, time) {
  messages.push({ text, type, time });
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
clearBtn.addEventListener("click", clearChat);
themeToggle.addEventListener("click", toggleTheme);

// Send user message
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  const time = getTime();
  addMessage(text, "sent", time);
  saveMessage(text, "sent", time);
  messageInput.value = "";
  botReply(text);
}

// Bot response with typing indicator
function botReply(userText) {
  typingIndicator.style.display = "block";
  setTimeout(() => {
    typingIndicator.style.display = "none";
    const reply = generateBotReply(userText);
    const time = getTime();
    addMessage(reply, "received", time);
    saveMessage(reply, "received", time);
  }, 1200);
}

// Expanded bot conversation
function generateBotReply(input) {
  input = input.toLowerCase();

  const greetings = ["hello", "hi", "hey", "good morning", "good evening"];
  const farewells = ["bye", "goodbye", "see you", "see ya"];
  const feelings = ["how are you", "how r u", "how is it going"];
  const thanks = ["thanks", "thank you", "thx"];
  const nameQueries = ["your name", "who are you", "who r u"];
  const moodQueries = ["what are you doing", "whats up", "what's up"];

  if (greetings.some(word => input.includes(word))) return "Hi there! 👋";
  if (farewells.some(word => input.includes(word))) return "Goodbye! Take care! 👋";
  if (feelings.some(word => input.includes(word))) return "I’m just a bot, but I’m doing great! 😄 How about you?";
  if (thanks.some(word => input.includes(word))) return "You’re welcome! 😊";
  if (nameQueries.some(word => input.includes(word))) return "I’m ChatBot 🤖, nice to meet you!";
  if (moodQueries.some(word => input.includes(word))) return "Just chatting with you! 😎";
  if (input.includes("joke")) return "Why did the computer go to the doctor? Because it caught a virus! 😂";

  // Default reply
  return "Hmm... interesting! Tell me more.";
}

// Clear chat
function clearChat() {
  if (confirm("Clear all chat messages?")) {
    messages = [];
    localStorage.removeItem("chatMessages");
    chatBox.innerHTML = "";
  }
}

// Toggle day/night theme
function toggleTheme() {
  body.classList.toggle("night");
  nightMode = body.classList.contains("night");
  localStorage.setItem("nightMode", nightMode);
  themeToggle.textContent = nightMode ? "☀️" : "🌙";
}
