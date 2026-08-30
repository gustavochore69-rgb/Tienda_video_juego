// DATA.JS - Todos los datos del sitio PixelStore

const USERS = [
  { id: 1, fullName: 'Admin PixelStore', username: 'admin', email: 'admin@pixel.test', phone: '2200-0001', role: 'admin', password: 'admin123', createdAt: '2025-01-10', banned: false },
  { id: 2, fullName: 'Carlos Vendedor', username: 'vendedor', email: 'vendedor@pixel.test', phone: '3300-4455', role: 'vendor', password: 'vendedor123', createdAt: '2025-02-14', banned: false },
  { id: 3, fullName: 'Maria Lopez', username: 'maria', email: 'maria@gmail.com', phone: '8800-1122', role: 'client', password: 'maria123', createdAt: '2025-03-05', banned: false }
];

const GAMES = [
  { id: 1, title: 'Zelda: Tears of the Kingdom', genres: ['accion','rpg','aventura'], genreLabel: 'Aventura · RPG', image: 'https://zeldacentral.com/wp-content/uploads/2025/03/Tears-of-the-Kingdom-wallpaper.jpg', price: 59.99, platform: 'Nintendo Switch', developer: 'Nintendo EPD', description: 'Explora los cielos y las profundidades de Hyrule en esta aventura de mundo abierto llena de magia, combate e ingenio.' },
  { id: 2, title: 'Hollow Knight', genres: ['aventura','indie'], genreLabel: 'Aventura · Indie', image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/mixcollage-07-dec-2024-08-04-am-836.jpg', price: 14.99, originalPrice: 59.99, discount: 75, platform: 'PC, Switch, PS4, Xbox One', developer: 'Team Cherry', description: 'Un metroidvania dibujado a mano ambientado en el reino subterráneo de Hallownest, lleno de secretos y jefes desafiantes.' },
  { id: 3, title: 'Resident Evil Requiem', genres: ['aventura','accion'], genreLabel: 'Survival · Acción', image: 'https://livewallpapers4free.com/wp-content/uploads/2026/02/leon-resident-evil-9-requiem-HD-live_thumb1.jpg', price: 69.99, platform: 'PS5, Xbox Series X|S, PC', developer: 'Capcom', description: 'La nueva entrega de la saga survival horror con una tensión narrativa renovada y gráficos de última generación.' },
  { id: 4, title: 'Minecraft', genres: ['aventura','simulacion','indie'], genreLabel: 'Aventura · Survival', image: 'https://store-images.s-microsoft.com/image/apps.60323.14294656681058683.4d17bdd8-7026-429a-846f-cf7836bc9e56.a69e6905-8926-4a48-b243-14a039b97aae?mode=scale&q=90&h=1080&w=1920&format=jpg', price: 26.99, platform: 'PC, Consolas, Móvil', developer: 'Mojang Studios', description: 'Construye, explora y sobrevive en un mundo generado por bloques con posibilidades infinitas.' },
  { id: 5, title: 'Mario Kart 8 Deluxe', genres: ['simulacion'], genreLabel: 'Carrera · Multijugador', image: 'https://images7.alphacoders.com/821/821837.jpg', price: 59.99, platform: 'Nintendo Switch', developer: 'Nintendo EPD', description: 'Carreras frenéticas multijugador con los personajes clásicos de Mario y pistas llenas de sorpresas.' },
  { id: 6, title: 'Elden Ring', genres: ['accion','rpg'], genreLabel: 'Acción · Mundo Abierto', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', price: 35.99, originalPrice: 59.99, discount: 40, platform: 'PS5, Xbox Series X|S, PC', developer: 'FromSoftware', description: 'Un RPG de acción en mundo abierto creado junto a George R. R. Martin, con combates exigentes y un vasto mundo por descubrir.' },
  { id: 7, title: 'God of War', genres: ['aventura','accion'], genreLabel: 'Aventura · Acción', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg', price: 24.99, originalPrice: 49.99, discount: 50, platform: 'PS5, PC', developer: 'Santa Monica Studio', description: 'Kratos y Atreus emprenden un viaje por los reinos nórdicos en esta épica aventura de acción.' },
  { id: 8, title: "Baldur's Gate 3", genres: ['rpg'], genreLabel: 'RPG · Estrategia', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg', price: 47.99, originalPrice: 59.99, discount: 20, platform: 'PC, PS5, Xbox Series X|S', developer: 'Larian Studios', description: 'Un RPG por turnos basado en Dungeons & Dragons con decisiones que moldean tu historia.' },
  { id: 9, title: 'Cyberpunk 2077', genres: ['accion','rpg'], genreLabel: 'RPG · Ciencia Ficción', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', price: 17.99, originalPrice: 59.99, discount: 70, platform: 'PC, PS5, Xbox Series X|S', developer: 'CD Projekt Red', description: 'Sumérgete en Night City, una metrópolis futurista repleta de tecnología, poder y peligro.' },
  { id: 10, title: 'Hades', genres: ['indie','accion'], genreLabel: 'Roguelike · Indie', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg', price: 12.49, originalPrice: 24.99, discount: 50, platform: 'PC, Switch, PS5, Xbox Series X|S', developer: 'Supergiant Games', description: 'Un roguelike de acción donde escapas del inframundo griego combinando combate ágil y narrativa profunda.' },
  { id: 11, title: 'Red Dead Redemption 2', genres: ['aventura','accion'], genreLabel: 'Mundo Abierto · Aventura', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg', price: 19.79, originalPrice: 59.99, discount: 67, platform: 'PS4, Xbox One, PC', developer: 'Rockstar Games', description: 'Vive la vida de un forajido en el ocaso del salvaje oeste americano en este épico mundo abierto.' },
  { id: 12, title: 'Civilization VI', genres: ['estrategia'], genreLabel: 'Estrategia · Turnos', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg', price: 8.99, originalPrice: 59.99, discount: 85, platform: 'PC, Switch, PS4, Xbox One', developer: 'Firaxis Games', description: 'Construye un imperio que perdure a través de los siglos en esta aclamada estrategia por turnos.' }
];

const CONSOLAS = [
  { id: 1, name: 'PlayStation 5', brand: 'PlayStation', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80', price: 499.99, developer: 'Sony Interactive Entertainment', description: 'La consola insignia de Sony con gráficos 4K, SSD ultrarrápido y control DualSense inmersivo.' },
  { id: 2, name: 'PlayStation 5 Slim', brand: 'PlayStation', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80', price: 449.99, developer: 'Sony Interactive Entertainment', description: 'Versión compacta de PS5 con el mismo poder gráfico en un diseño más reducido.' },
  { id: 3, name: 'PlayStation 5 Pro', brand: 'PlayStation', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80', price: 699.99, developer: 'Sony Interactive Entertainment', description: 'La versión más potente de PS5, con mejoras de rendimiento y ray tracing avanzado.' },
  { id: 4, name: 'Xbox Series X', brand: 'Xbox', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=80', price: 499.99, developer: 'Microsoft', description: 'La consola más potente de Xbox, con 4K nativo a 60 fps y Quick Resume.' },
  { id: 5, name: 'Xbox Series S', brand: 'Xbox', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900&q=80', price: 299.99, developer: 'Microsoft', description: 'Consola compacta y accesible de nueva generación, ideal para juego digital a 1440p.' },
  { id: 6, name: 'Nintendo Switch', brand: 'Nintendo', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80', price: 299.99, developer: 'Nintendo', description: 'Consola híbrida que combina juego portátil y de sobremesa con Joy-Con extraíbles.' },
  { id: 7, name: 'Nintendo Switch OLED', brand: 'Nintendo', image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80', price: 349.99, developer: 'Nintendo', description: 'Versión mejorada de Switch con pantalla OLED vibrante y mayor almacenamiento.' }
];

// Reseñas iniciales (semilla). Se guardan y actualizan en localStorage bajo la clave 'ps_reviews'.
// Clave del objeto: `${type}-${id}` donde type es 'game' o 'consola'.
const REVIEWS_SEED = {
  'game-1': [
    { user: 'Maria Lopez', rating: 5, comment: 'Una obra maestra, el mundo es enorme y siempre hay algo nuevo que descubrir.', date: '2025-06-02' },
    { user: 'Carlos V.', rating: 4, comment: 'Excelente juego, aunque el rendimiento baja un poco en zonas grandes.', date: '2025-06-10' }
  ],
  'game-6': [
    { user: 'Maria Lopez', rating: 5, comment: 'Difícil pero adictivo, el mejor Souls hasta la fecha.', date: '2025-05-20' }
  ],
  'game-9': [
    { user: 'Carlos V.', rating: 4, comment: 'Night City se siente viva. La historia me atrapó de principio a fin.', date: '2025-07-01' }
  ],
  'consola-1': [
    { user: 'Carlos V.', rating: 5, comment: 'Carga los juegos en segundos, una bestia de consola.', date: '2025-04-15' }
  ]
};

const VENDOR_PRODUCTS = [
  { id: 1, title: 'Elden Ring', price: 35.99, stock: 42, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' },
  { id: 2, title: 'Hollow Knight', price: 14.99, stock: 120, image: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/mixcollage-07-dec-2024-08-04-am-836.jpg' },
  { id: 3, title: 'Cyberpunk 2077', price: 17.99, stock: 85, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' }
];

const VENDOR_SALES = [
  { id: 1001, game: 'Elden Ring', buyer: 'juan@gmail.com', amount: 35.99, date: '2025-07-12', status: 'completado' },
  { id: 1002, game: 'Hollow Knight', buyer: 'ana@gmail.com', amount: 14.99, date: '2025-07-14', status: 'completado' },
  { id: 1003, game: 'Cyberpunk 2077', buyer: 'pedro@gmail.com', amount: 17.99, date: '2025-07-15', status: 'pendiente' },
  { id: 1004, game: 'Elden Ring', buyer: 'lucia@gmail.com', amount: 35.99, date: '2025-07-18', status: 'completado' },
  { id: 1005, game: 'Hollow Knight', buyer: 'carlos@gmail.com', amount: 14.99, date: '2025-07-20', status: 'completado' }
];

const DEMO_ACCOUNTS = [
  { label: 'Administrador', username: 'admin@pixel.test', password: 'admin123', role: 'admin' },
  { label: 'Vendedor', username: 'vendedor@pixel.test', password: 'vendedor123', role: 'vendor' },
  { label: 'Cliente', username: 'maria@gmail.com', password: 'maria123', role: 'client' }
];

const GENRES = [
  { id: 'todos', label: 'Todos' },
  { id: 'accion', label: 'Acción' },
  { id: 'aventura', label: 'Aventura' },
  { id: 'indie', label: 'Indie' },
  { id: 'rpg', label: 'RPG' },
  { id: 'simulacion', label: 'Simulación' },
  { id: 'estrategia', label: 'Estrategia' }
];

const ROLE_LABELS = { admin: 'Administrador', vendor: 'Vendedor', client: 'Cliente' };