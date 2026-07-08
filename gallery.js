// gallery.js - Lógica principal da galeria FlowSketch
// Agora carrega dados do images.js e possui sistema de filtros

// Arrays para armazenar obras em memória
let allArtworks = []; // Guarda TODAS as obras intactas
let artworks = [];    // Guarda apenas as obras que estão sendo exibidas (filtradas)

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Garante 2 dígitos
  const day = String(date.getDate()).padStart(2, '0');       // Garante 2 dígitos
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

// Função para adicionar nova obra programaticamente
function addArtwork(artworkData) {
  allArtworks.unshift(artworkData);
  
  // Verifica se a obra atual se encaixa no filtro selecionado
  const currentFilter = document.getElementById('authorFilter')?.value || 'all';
  if (currentFilter === 'all' || currentFilter === artworkData.artist.trim()) {
    artworks.unshift(artworkData);
    renderGallery();
  }
  
  console.log(`✅ Nova obra adicionada: "${artworkData.title}" por ${artworkData.artist}`);
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
        <h3>🎨 Empty Gallery</h3>
        <p>No artworks found for this selection. Flow some more!</p>
      </div>
    `;
    return;
  }
  
  // Limpa galeria
  gallery.innerHTML = '';
  console.log(`🖼️ Rendering ${artworks.length} works...`);
  
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
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwVjIwME0xNTAgMTUwSDI1MCIgc3Ryb2tlPSIjQ0NDIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB4PSIyMDAiIHk9IjI0MCI+SW1hZ2VtIG7Do28gZW5jb250cmFkYTwvdGV4dD4KPC9zdmc+'; this.alt='Imagem não encontrada';">
      </div>
      <div class="artwork-info">
        <div class="artwork-title">${artwork.title}</div>
        <div class="artwork-artist">por ${artwork.artist}</div>
        <div class="artwork-date">${formatDate(artwork.date)}</div>
        <div class="artwork-stats">${artwork.points.toLocaleString()} Movement points</div>
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
    }, index * 100);
  });
  
  console.log(`✅ Gallery successfully rendered!`);
}

// Configura o filtro de autores dinamicamente
function setupFilter() {
  const filterSelect = document.getElementById('authorFilter');
  if (!filterSelect) return;

  // Extrai nomes únicos e coloca em ordem alfabética
  const uniqueArtists = [...new Set(allArtworks.map(art => art.artist.trim()))]
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  // Reseta as opções mantendo apenas o "everyone"
  filterSelect.innerHTML = '<option value="all">everyone</option>';

  // Preenche o dropdown com os artistas encontrados no images.js
  uniqueArtists.forEach(artist => {
    const option = document.createElement('option');
    option.value = artist;
    option.textContent = artist.toLowerCase();
    filterSelect.appendChild(option);
  });

  // Lógica de filtragem ao trocar a opção
  filterSelect.addEventListener('change', (e) => {
    const selectedAuthor = e.target.value;

    if (selectedAuthor === 'all') {
      artworks = [...allArtworks]; // Mostra tudo
    } else {
      artworks = allArtworks.filter(art => art.artist.trim() === selectedAuthor); // Filtra
    }

    renderGallery();
  });
}

// Função para carregar obras do images.js
function loadImagesFromDatabase() {
  if (typeof window.FlowSketchImages === 'undefined') {
    console.error('❌ images.js did not load! Please check if the file is included in the HTML.');
    return;
  }
  
  console.log(`📂 Loading ${window.FlowSketchImages.length} database works...`);
  
  // Clona o array original para a memória
  allArtworks = window.FlowSketchImages.map(artwork => ({...artwork}));
  artworks = [...allArtworks]; // Inicia mostrando tudo
  
  console.log(`✅ ${artworks.length} works successfully uploaded!`);
  
  setupFilter(); // Inicia o filtro após carregar os dados
  renderGallery();
}

// Função para recarregar dados
function reloadGallery() {
  console.log('🔄 Reloading gallery...');
  loadImagesFromDatabase();
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 FlowSketch Gallery starting up...');
  setTimeout(() => {
    loadImagesFromDatabase();
  }, 100);
});

// API pública para extensão e integrações externas
window.FlowSketchGallery = {
  addArtwork: addArtwork,
  getArtworks: () => [...allArtworks],
  renderGallery: renderGallery,
  reloadGallery: reloadGallery,
  clearGallery: () => {
    artworks = [];
    renderGallery();
  },
  getStats: () => ({
    total: allArtworks.length,
    totalPoints: allArtworks.reduce((sum, art) => sum + art.points, 0),
    artists: [...new Set(allArtworks.map(art => art.artist))].length,
    latestDate: allArtworks.length > 0 ? allArtworks[0].date : null
  })
};

// Debug
window.FlowSketchDebug = {
  artworks: () => allArtworks,
  reloadImages: () => {
    const script = document.createElement('script');
    script.src = 'images.js?v=' + Date.now();
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('🔄 images.js recarregado!');
      loadImagesFromDatabase();
    };
  }
};
