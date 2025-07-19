const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const REPLICATE_API_TOKEN = 'MASUKKAN_TOKEN_KAMU_DI_SINI';

app.post('/generate', async (req, res) => {
  const { image } = req.body;
  try {
    const resp = await axios.post('https://api.replicate.com/v1/predictions', {
      version: "a9758cbf7f8e2d27ad2781ee4ff6f35a3d676a962705f2f7a99f25b3780caa3d",
      input: { image, prompt: "semi-realistic game character, ultra-detailed, 4k", guidance_scale: 7, num_inference_steps: 30 }
    }, {
      headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}`, 'Content-Type': 'application/json' }
    });

    const getUrl = resp.data.urls.get;
    let status = resp.data.status, output = null;

    while (status !== 'succeeded' && status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000));
      const pol = await axios.get(getUrl, { headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` } });
      status = pol.data.status;
      if (status === 'succeeded') output = pol.data.output[0];
    }

    return output ? res.json({ image: output }) : res.status(500).json({ error: 'Generation failed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error contacting Replicate' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend ready at http://localhost:${PORT}`));