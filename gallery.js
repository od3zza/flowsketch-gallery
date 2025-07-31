// Array para armazenar obras (mais recentes primeiro)
const artworks = [];

// Função para formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Função para adicionar nova obra
function addArtwork(artworkData) {
  // Adiciona no INÍCIO do array (mais recentes primeiro)
  artworks.unshift(artworkData);
  renderGallery();
}

// Função para renderizar galeria
function renderGallery() {
  const gallery = document.getElementById('gallery');
  
  if (artworks.length === 0) {
    gallery.innerHTML = '<div class="gallery-empty">Nenhuma obra ainda. Seja o primeiro a contribuir!</div>';
    return;
  }

  // Limpa galeria
  gallery.innerHTML = '';

  // Renderiza cada obra (mais recentes primeiro)
  artworks.forEach(artwork => {
    const artworkElement = document.createElement('div');
    artworkElement.className = 'artwork';
    
    artworkElement.innerHTML = `
      <div class="artwork-image-container">
        <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
      </div>
      <div class="artwork-info">
        <div class="artwork-title">${artwork.title}</div>
        <div class="artwork-artist">por ${artwork.artist}</div>
        <div class="artwork-date">${formatDate(artwork.date)}</div>
        <div class="artwork-stats">${artwork.points.toLocaleString()} pontos de movimento</div>
      </div>
    `;
    
    gallery.appendChild(artworkElement);
  });
}

// Função para carregar obras iniciais (dados existentes)
function loadInitialArtworks() {
  // Carrega obras existentes em ordem cronológica
  // O addArtwork() vai inverter automaticamente para mostrar mais recentes primeiro
  
  const initialArtworks = [
    {
      title: "6try",
      artist: "od3zza",
      date: "2025-07-31T10:00:00",
      points: 1664,
      image: "images/artwork_1753991414884.png"
    },
    {
      title: "7try", 
      artist: "od3zza",
      date: "2025-07-31T11:00:00", 
      points: 3274,
      image: "images/artwork_1753992319879.png"
    }
  ];

  // Adiciona cada obra (mais antigas primeiro, para ficarem na ordem correta após inversão)
  initialArtworks.forEach(artwork => {
    addArtwork(artwork);
  });
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 EmotiSketch Gallery carregada!');
  
  // Carrega obras iniciais
  loadInitialArtworks();
});

// API pública para extensão e integrações externas
window.EmotiSketchGallery = {
  addArtwerk: addArtwork,        // Adiciona nova obra
  getArtworks: () => artworks,   // Obtém todas as obras
  renderGallery: renderGallery,  // Re-renderiza galeria
  clearGallery: () => {          // Limpa todas as obras
    artworks.length = 0;
    renderGallery();
  }
};
