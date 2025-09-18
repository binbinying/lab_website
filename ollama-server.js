// ...existing code...
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  try {
    // accept multiple possible property names from different clients
    const userPrompt = req.body.prompt || req.body.message || req.body.text || req.body.input;
    console.log('Incoming chat request body:', req.body);
    console.log('Resolved userPrompt:', userPrompt);

    if (!userPrompt) {
      return res.status(400).json({ error: 'No prompt/message provided' });
    }

    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'mistral',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userPrompt }
      ],
      stream: false
    });

    // log raw response for debugging
    console.log('Ollama response.data:', JSON.stringify(response.data, null, 2));

    // robust extractor with fallbacks for common API shapes
    const message =
      response.data?.message?.content ||
      response.data?.choices?.[0]?.message?.content ||
      response.data?.choices?.[0]?.text ||
      response.data?.output?.[0]?.content?.[0]?.text ||
      response.data?.result?.[0]?.content ||
      null;

    if (!message) {
      // send raw response so frontend can inspect it while debugging
      return res.json({ reply: null, raw: response.data });
    }

    res.json({ reply: message });
  } catch (err) {
    // log details to help debugging
    console.error('Ollama API error:', err.message);
    if (err.response) {
      console.error('Ollama response status:', err.response.status);
      console.error('Ollama response data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err);
    }
    res.status(500).json({ error: 'Failed to fetch response from Ollama', details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🟢 Ollama proxy server listening at http://localhost:${PORT}`);
});