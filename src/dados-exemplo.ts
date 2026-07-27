import { Produto } from './types';

export const produtosMias: Produto[] = [
  {
    id: '1',
    nome: 'Vestido Midi Elegância Plissada',
    preco: 249.90,
    precoAntigo: 299.90,
    categoria: 'vestidos',
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    novidade: true,
    destaque: true,
    descricao: 'Confeccionado em crepe de alta qualidade, com caimento fluido, mangas delicadas e cinto do mesmo tecido incluso.'
  },
  {
    id: '2',
    nome: 'Conjunto Alfaiataria Grace Rosé',
    preco: 289.90,
    categoria: 'conjuntos',
    tamanhos: ['36', '38', '40', '42', '44'],
    imagem: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    novidade: true,
    destaque: true,
    descricao: 'Blazer acinturado com botões encapados e saia midi lápis impecável. Ideal para cultos solenes e eventos corporativos.'
  },
  {
    id: '3',
    nome: 'Vestido Royal Bordado à Mão',
    preco: 319.90,
    precoAntigo: 369.90,
    categoria: 'vestidos',
    tamanhos: ['P', 'M', 'G'],
    imagem: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    destaque: true,
    descricao: 'Peça exclusiva com detalhes em renda na gola e punhos, transmitindo toda a beleza e recato que você merece.'
  },
  {
    id: '4',
    nome: 'Saia Midi Godê Romântica',
    preco: 159.90,
    categoria: 'saias',
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    novidade: true,
    descricao: 'Cintura alta marcada com elástico confortável nas costas e movimento gracioso em camadas leves.'
  },
  {
    id: '5',
    nome: 'Blusa Crepe Princesa Laço',
    preco: 119.90,
    categoria: 'blusas',
    tamanhos: ['P', 'M', 'G'],
    imagem: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    descricao: 'Mangas bufantes delicadas e laço frontal removível. Perfeita para harmonizar com saias secretária e midi.'
  },
  {
    id: '6',
    nome: 'Vestido Floral Jardim Secreto',
    preco: 229.90,
    precoAntigo: 269.90,
    categoria: 'vestidos',
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    destaque: true,
    descricao: 'Estampa exclusiva inspirada na natureza, forro interno macio e modelagem godê que veste com conforto absoluto.'
  }
];