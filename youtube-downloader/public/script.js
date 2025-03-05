function downloadVideo() {
  const url = document.getElementById('video-url').value.trim();
  const statusDiv = document.getElementById('status');

  if (!url) {
    statusDiv.textContent = 'Por favor, insira o link do vídeo.';
    statusDiv.style.color = 'red';
    return;
  }

  statusDiv.textContent = 'Processando... Aguarde enquanto o MP3 está sendo gerado.';
  statusDiv.style.color = 'blue';

  // Faz uma requisição para obter o título do vídeo antes de iniciar o download
  fetch(`/download?url=${encodeURIComponent(url)}`)
    .then(response => {
      if (response.ok) {
        // Obtém o nome do arquivo a partir do cabeçalho "Content-Disposition"
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'audio.mp3'; // Nome padrão caso falhe

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+?)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        // Criar um link oculto para iniciar o download
        return response.blob().then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          statusDiv.textContent = 'Download iniciado!';
          statusDiv.style.color = 'green';
        });
      } else {
        throw new Error('Erro ao baixar o MP3.');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      statusDiv.textContent = 'Erro ao processar o download.';
      statusDiv.style.color = 'red';
    });
}
