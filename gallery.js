// script.js - Lógica principal da galeria EmotiSketch
// Agora carrega dados do images.js

// Array para armazenar obras em memória (mais recentes primeiro)
let artworks = [];

// Função para formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Função para adicionar nova obra
function addArtwork(artworkData) {
  // Adiciona no INÍCIO do array (mais recentes primeiro)
  artworks.unshift(artworkData);
  console.log(`✅ Nova obra adicionada: "${artworkData.title}" por ${artworkData.artist}`);
  renderGallery();
}

// Função para renderizar galeria
function renderGallery() {
  const gallery = document.getElementById('gallery');
  
  if (!gallery) {
    console.error('❌ Elemento #gallery não encontrado!');
    return;
  }
  
  if (artworks.length === 0) {
    gallery.innerHTML = `
      <div class="gallery-empty">
        <h3>🎨 Galeria Vazia</h3>
        <p>Seja o primeiro a contribuir com sua arte emocional!</p>
        <p>Instale a extensão EmotiSketch e comece a criar.</p>
      </div>
    `;
    return;
  }
  
  // Limpa galeria
  gallery.innerHTML = '';
  
  console.log(`🖼️ Renderizando ${artworks.length} obras...`);
  
  // Renderiza cada obra (mais recentes primeiro)
  artworks.forEach((artwork, index) => {
    const artworkElement = document.createElement('div');
    artworkElement.className = 'artwork';
    artworkElement.setAttribute('data-artwork-id', index);
    
    artworkElement.innerHTML = `
      <div class="artwork-image-container">
        <img src="${artwork.image}" 
             alt="${artwork.title}" 
             loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwVjIwME0xNTAgMTUwSDI1MCIgc3Ryb2tlPSIjQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRLEHT4gZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB4PSIyMDAiIHk9IjI0MCI+SW1hZ2VtIG7Do28gZW5jb250cmFkYTwvdGV4dD4KPC9zdmc+'; this.alt='Imagem não encontrada';">
      </div>
      <div class="artwork-info">
        <div class="artwork-title">${artwork.title}</div>
        <div class="artwork-artist">por ${artwork.artist}</div>
        <div class="artwork-date">${formatDate(artwork.date)}</div>
        <div class="artwork-stats">${artwork.points.toLocaleString()} pontos de movimento</div>
      </div>
    `;
    
    // Adiciona animação suave
    artworkElement.style.opacity = '0';
    artworkElement.style.transform = 'translateY(20px)';
    
    gallery.appendChild(artworkElement);
    
    // Anima entrada
    setTimeout(() => {
      artworkElement.style.transition = 'all 0.5s ease';
      artworkElement.style.opacity = '1';
      artworkElement.style.transform = 'translateY(0)';
    }, index * 100); // Delay escalonado
  });
  
  console.log(`✅ Galeria renderizada com sucesso!`);
}

// Função para carregar obras do images.js
function loadImagesFromDatabase() {
  if (typeof window.EmotiSketchImages === 'undefined') {
    console.error('❌ images.js não foi carregado! Verifique se o arquivo está incluído no HTML.');
    return;
  }
  
  console.log(`📂 Carregando ${window.EmotiSketchImages.length} obras do banco de dados...`);
  
  // Limpa array atual
  artworks = [];
  
  // Carrega todas as obras do images.js
  // Já estão em ordem cronológica (mais recentes primeiro)
  window.EmotiSketchImages.forEach(artwork => {
    artworks.push({
      title: artwork.title,
      artist: artwork.artist,
      date: artwork.date,
      points: artwork.points,
      image: artwork.image
    });
  });
  
  console.log(`✅ ${artworks.length} obras carregadas com sucesso!`);
  renderGallery();
}

// Função para recarregar dados (útil quando images.js é atualizado)
function reloadGallery() {
  console.log('🔄 Recarregando galeria...');
  loadImagesFromDatabase();
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 EmotiSketch Gallery inicializando...');
  
  // Aguarda um pouco para garantir que images.js foi carregado
  setTimeout(() => {
    loadImagesFromDatabase();
  }, 100);
});

// API pública para extensão e integrações externas
window.EmotiSketchGallery = {
  // Adiciona nova obra programaticamente
  addArtwork: addArtwork,
  
  // Obtém todas as obras carregadas
  getArtworks: () => [...artworks], // Retorna cópia do array
  
  // Re-renderiza galeria
  renderGallery: renderGallery,
  
  // Recarrega do banco de dados
  reloadGallery: reloadGallery,
  
  // Limpa galeria (apenas visual)
  clearGallery: () => {
    artworks = [];
    renderGallery();
  },
  
  // Estatísticas
  getStats: () => ({
    total: artworks.length,
    totalPoints: artworks.reduce((sum, art) => sum + art.points, 0),
    artists: [...new Set(artworks.map(art => art.artist))].length,
    latestDate: artworks.length > 0 ? artworks[0].date : null
  })
};

// Debug: expõe no console para facilitar testes
window.EmotiSketchDebug = {
  artworks: () => artworks,
  reloadImages: () => {
    // Força reload do images.js
    const script = document.createElement('script');
    script.src = 'images.js?v=' + Date.now();
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('🔄 images.js recarregado!');
      loadImagesFromDatabase();
    };
  }
};

console.log('📱 Script.js carregado! Use EmotiSketchGallery.* para interagir com a galeria.');
