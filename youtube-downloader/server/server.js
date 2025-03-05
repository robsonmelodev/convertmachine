const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Rota para baixar e converter o vídeo para MP3
app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('URL do vídeo não fornecida.');
  }

  try {
    // Obtém as informações do vídeo
    const info = await ytdl.getInfo(videoUrl);
    let title = info.videoDetails.title || "audio";
    
    // Remove caracteres inválidos do título
    title = title.replace(/[\/:*?"<>|]/g, '');

    // Define os cabeçalhos para forçar o download com o nome correto
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // Inicia o download e conversão para MP3
    const stream = ytdl(videoUrl, { filter: 'audioonly' });

    ffmpeg(stream)
      .audioBitrate(128)
      .format('mp3')
      .pipe(res, { end: true });

  } catch (error) {
    console.error('Erro ao processar o vídeo:', error);
    res.status(500).send('Erro ao processar o vídeo.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
