export type Produto = {
  id: string;
  nome: string;
  preco: number;
  precoAntigo?: number;
  categoria: 'vestidos' | 'conjuntos' | 'saias' | 'blusas';
  tamanhos: string[];
  imagem: string;
  novidade?: boolean;
  destaque?: boolean;
  descricao: string;
};

export type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
  tamanhoEscolhido: string;
};