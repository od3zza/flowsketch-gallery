// api/share.js
export default async function handler(req, res) {
  // 1. Configuração de CORS para permitir que a extensão do Chrome acesse esta API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Responde imediatamente a requisições de preflight (verificação do navegador)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Apenas requisições POST são permitidas' });
  }

  try {
    const { title, artist, image, points, date } = req.body;

    // Configurações do Repositório
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Variável de ambiente secreta no Vercel
    const REPO_OWNER = 'od3zza';
    const REPO_NAME = 'flowsketch-gallery';
    const BRANCH = 'main';

    if (!GITHUB_TOKEN) {
      throw new Error('Token do GitHub não configurado no servidor.');
    }

    // 2. Prepara a Imagem (Remove o cabeçalho do DataURL para ficar só o Base64 puro)
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const imageFilename = `images/artwork_${Date.now()}.png`;

    // 3. Faz o Upload da Imagem para o GitHub
    const imageUploadResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${imageFilename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload de arte: ${title} por ${artist}`,
        content: base64Image,
        branch: BRANCH
      })
    });

    if (!imageUploadResponse.ok) {
      throw new Error('Falha ao fazer upload da imagem no GitHub');
    }

    // 4. Atualiza o arquivo images.js
    // 4.1 Pega o arquivo atual
    const dbResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/images.js`, {
      headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}` }
    });
    const dbData = await dbResponse.json();
    
    // Decodifica o conteúdo atual (que vem em base64 do GitHub)
    const currentContent = Buffer.from(dbData.content, 'base64').toString('utf-8');

    // 4.2 Cria o novo bloco de dados da obra
    const newArtworkObj = {
      title,
      artist,
      date,
      points,
      image: imageFilename
    };
    
    // Converte o objeto em uma string formatada
    const newEntryString = `  {\n    title: "${newArtworkObj.title}",\n    artist: "${newArtworkObj.artist}",\n    date: "${newArtworkObj.date}",\n    points: ${newArtworkObj.points},\n    image: "${newArtworkObj.image}"\n  },\n`;

    // Insere a nova obra logo após a abertura do array 'window.FlowSketchImages = ['
    const updatedContent = currentContent.replace(
      'window.FlowSketchImages = [', 
      `window.FlowSketchImages = [\n${newEntryString}`
    );

    // 4.3 Salva o images.js modificado de volta no GitHub
    await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/images.js`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Adiciona obra: ${title} no banco de dados`,
        content: Buffer.from(updatedContent).toString('base64'),
        sha: dbData.sha, // O SHA é obrigatório para atualizar arquivos no GitHub
        branch: BRANCH
      })
    });

    // 5. Retorna sucesso para a extensão
    return res.status(200).json({ success: true, message: 'Arte salva e publicada na galeria!' });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ message: error.message });
  }
}
