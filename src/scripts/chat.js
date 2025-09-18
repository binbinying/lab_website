document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userInput = input.value.trim();
    if (!userInput) return;

    // Display user message
    appendMessage('You', userInput);
    input.value = '';

    try {
      // POST to your local RAG server
      const response = await fetch('http://localhost:5000/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: userInput })
      });

      const data = await response.json();
      appendMessage('Bot', data.answer || '⚠️ No reply received.');
    } catch (err) {
      console.error('Error:', err);
      appendMessage('Bot', '⚠️ Error connecting to the server.');
    }
  });

  function appendMessage(sender, text) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');
    messageElem.innerHTML = `<strong>${sender}:</strong> ${text}`;
    messages.appendChild(messageElem);
    messages.scrollTop = messages.scrollHeight;
  }
});