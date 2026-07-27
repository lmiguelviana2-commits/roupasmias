import React, { useState, useEffect } from 'react';
import { produtosMias } from './dados-exemplo';
import { Produto, ItemCarrinho } from './types';

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#\/?/, '') || 'home');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [isCarrinhoOpen, setIsCarrinhoOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Sincronizar hash
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = window.location.hash.replace(/^#\/?/, '') || 'home';
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const adicionarAoCarrinho = (produto: Produto, tamanho: string) => {
    if (!tamanho) {
      alert('Por favor, escolha um tamanho antes de adicionar.');
      return;
    }
    setCarrinho(prev => {
      const existe = prev.find(item => item.produto.id === produto.id && item.tamanhoEscolhido === tamanho);
      if (existe) {
        return prev.map(item => 
          item.produto.id === produto.id && item.tamanhoEscolhido === tamanho
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1, tamanhoEscolhido: tamanho }];
    });
    setIsCarrinhoOpen(true);
    setFeedbackMsg(`Adicionado: ${produto.nome} (${tamanho})`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const qtdTotalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const valorTotalCarrinho = carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

  const produtosFiltrados = produtosMias.filter(p => {
    const matchCat = categoriaAtiva === 'todos' || p.categoria === categoriaAtiva;
    const matchBusca = p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || p.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchCat && matchBusca;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-rose-200">check_circle</span>
          <span className="text-sm font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Top Bar Promocional */}
      <div className="bg-rose-900 text-rose-50 text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">local_shipping</span>
        <span>Frete Grátis para todo o Brasil nas compras acima de R$ 299 • Parcele em até 6x sem juros</span>
      </div>

      {/* Header Principal */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#/home" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-rose-900 text-rose-100 flex items-center justify-center font-serif text-2xl font-bold shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight block">Roupas Mias</span>
              <span className="text-[10px] uppercase tracking-widest text-rose-800 font-semibold">Moda Gospel Elegante</span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#/home" className={`transition-colors hover:text-rose-900 ${route === 'home' ? 'text-rose-900 border-b-2 border-rose-900 pb-1' : ''}`}>Início</a>
            <a href="#/colecao" className={`transition-colors hover:text-rose-900 ${route === 'colecao' ? 'text-rose-900 border-b-2 border-rose-900 pb-1' : ''}`}>Coleção</a>
            <a href="#/sobre" className={`transition-colors hover:text-rose-900 ${route === 'sobre' ? 'text-rose-900 border-b-2 border-rose-900 pb-1' : ''}`}>Nossa Essência</a>
            <a href="#/contato" className={`transition-colors hover:text-rose-900 ${route === 'contato' ? 'text-rose-900 border-b-2 border-rose-900 pb-1' : ''}`}>Contato</a>
          </nav>

          {/* Ações (Busca & Sacola) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCarrinhoOpen(true)}
              className="relative p-2.5 rounded-full bg-rose-50 text-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-2 px-4 border border-rose-200/50"
              aria-label="Abrir sacola de compras"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="text-xs font-bold hidden sm:inline">Sacola</span>
              {qtdTotalItens > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {qtdTotalItens}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Menu Mobile */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex justify-around text-xs font-semibold text-slate-700">
        <a href="#/home" className={route === 'home' ? 'text-rose-900' : ''}>Início</a>
        <a href="#/colecao" className={route === 'colecao' ? 'text-rose-900' : ''}>Coleção</a>
        <a href="#/sobre" className={route === 'sobre' ? 'text-rose-900' : ''}>Essência</a>
        <a href="#/contato" className={route === 'contato' ? 'text-rose-900' : ''}>Contato</a>
      </div>

      {/* CONTEÚDO DAS PÁGINAS */}
      <main className="flex-grow">
        {route === 'home' && (
          <div>
            {/* Hero Section com Estilo Elegante */}
            <section className="relative overflow-hidden bg-gradient-to-b from-rose-900/10 via-rose-50/50 to-white py-20 px-4 md:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-6">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    <span>Nova Coleção Outono-Inverno</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Moda Evangélica com <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-900 via-pink-700 to-rose-700 font-serif italic">Elegância e Recato</span>
                  </h1>
                  <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                    Vestidos midi, alfaiataria fina e conjuntos criados para mulheres que valorizam a beleza clássica, o bom gosto e o pudor.
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <a 
                      href="#/colecao"
                      className="px-8 py-4 rounded-xl bg-rose-900 text-white font-bold text-sm hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 flex items-center gap-2"
                    >
                      <span>Ver Coleção Completa</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                    <a 
                      href="#/sobre"
                      className="px-8 py-4 rounded-xl bg-white text-slate-800 font-semibold text-sm border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                      Nossa História
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80" 
                      alt="Moda evangélica elegante Mias"
                      className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 text-white">
                      <span className="text-xs uppercase tracking-widest text-rose-300 font-bold block mb-1">Destaque da Semana</span>
                      <p className="font-serif text-xl font-medium">Vestido Midi Plissado Royal</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção Destaques da Vitrine */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <span className="text-xs uppercase tracking-widest text-rose-800 font-bold block mb-2">Tendências Mias</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Peças Mais Desejadas</h2>
                </div>
                <a href="#/colecao" className="mt-4 md:mt-0 text-sm font-bold text-rose-900 hover:text-rose-700 flex items-center gap-1">
                  <span>Ver todas as peças</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {produtosMias.filter(p => p.destaque).map(produto => (
                  <div key={produto.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/5] bg-slate-100">
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' }}
                      />
                      {produto.novidade && (
                        <span className="absolute top-3 left-3 bg-rose-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          Novo
                        </span>
                      )}
                      <button 
                        onClick={() => setProdutoSelecionado(produto)}
                        className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs py-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Ver Detalhes</span>
                      </button>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs text-rose-800 font-semibold uppercase tracking-wider mb-1">{produto.categoria}</span>
                      <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-900 transition-colors">{produto.nome}</h3>
                      <div className="mt-auto flex items-baseline gap-3 pt-4 border-t border-slate-100">
                        <span className="text-xl font-extrabold text-slate-900">
                          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        {produto.precoAntigo && (
                          <span className="text-sm text-slate-400 line-through">
                            {produto.precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Banner Diferenciais */}
            <section className="bg-rose-900 text-white py-16 px-4 md:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="material-symbols-outlined text-4xl text-rose-300 mb-4">verified</span>
                  <h4 className="font-serif text-xl font-bold mb-2">Modéstia com Sofisticação</h4>
                  <p className="text-sm text-rose-100 leading-relaxed">Modelagens testadas para garantir caimento impecável, decotes adequados e forros de alta qualidade.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="material-symbols-outlined text-4xl text-rose-300 mb-4">local_shipping</span>
                  <h4 className="font-serif text-xl font-bold mb-2">Envio Rápido e Seguro</h4>
                  <p className="text-sm text-rose-100 leading-relaxed">Enviamos para todo o Brasil com código de rastreio e embalagem perfumada exclusiva.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="material-symbols-outlined text-4xl text-rose-300 mb-4">credit_card</span>
                  <h4 className="font-serif text-xl font-bold mb-2">Facilidade no Pagamento</h4>
                  <p className="text-sm text-rose-100 leading-relaxed">Parcelamento em até 6x sem juros no cartão ou 5% de desconto à vista no Pix.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {route === 'colecao' && (
          <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-rose-800 font-bold block mb-2">Catálogo Mias</span>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 font-serif">Nossa Coleção Completa</h1>
              <p className="text-slate-600">Escolha entre vestidos, conjuntos e saias criados para te acompanhar em todos os momentos com elegância.</p>
            </div>

            {/* Filtros e Busca */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {['todos', 'vestidos', 'conjuntos', 'saias', 'blusas'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaAtiva(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                      categoriaAtiva === cat 
                        ? 'bg-rose-900 text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-72 relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">search</span>
                <input 
                  type="text"
                  placeholder="Buscar peça..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-900 bg-white text-sm"
                />
              </div>
            </div>

            {/* Grid de Produtos */}
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">search_off</span>
                <p className="text-slate-600 font-medium">Nenhuma peça encontrada com essa busca.</p>
                <button 
                  onClick={() => { setCategoriaAtiva('todos'); setTermoBusca(''); }}
                  className="mt-4 px-6 py-2 bg-rose-900 text-white text-sm font-bold rounded-xl"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {produtosFiltrados.map(produto => (
                  <div key={produto.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/5] bg-slate-100">
                      <img 
                        src={produto.imagem} 
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' }}
                      />
                      {produto.novidade && (
                        <span className="absolute top-3 left-3 bg-rose-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          Novo
                        </span>
                      )}
                      <button 
                        onClick={() => setProdutoSelecionado(produto)}
                        className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs py-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Ver Detalhes & Comprar</span>
                      </button>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs text-rose-800 font-semibold uppercase tracking-wider mb-1">{produto.categoria}</span>
                      <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-900 transition-colors">{produto.nome}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{produto.descricao}</p>
                      <div className="mt-auto flex items-baseline justify-between pt-4 border-t border-slate-100">
                        <span className="text-xl font-extrabold text-slate-900">
                          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <button 
                          onClick={() => setProdutoSelecionado(produto)}
                          className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-lg hover:bg-rose-800 transition-colors"
                        >
                          Selecionar Tamanho
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {route === 'sobre' && (
          <div className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-rose-800 font-bold block mb-2">Nossa Essência</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif mb-4">Sobre a Roupas Mias</h1>
                <p className="text-slate-600 leading-relaxed">Vestindo a mulher cristã com dignidade, elegância e o recato que glorifica a sua fé em todos os momentos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Propósito e Dedicação</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    A Roupas Mias nasceu do sonho de oferecer à mulher evangélica peças que unam as últimas tendências da moda com os princípios do pudor e da modéstia.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Acreditamos que a verdadeira elegância vem de dentro, mas se reflete no cuidado com que escolhemos nossas vestimentas para ir à Casa do Senhor, ao trabalho ou em momentos especiais em família.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
                    alt="Moda e propósito Mias"
                    className="w-full h-80 object-cover"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8 text-center">
                <blockquote className="font-serif text-xl italic text-rose-900 max-w-xl mx-auto">
                  "A mulher virtuosa é a coroa do seu marido... Reveste-se de força e de dignidade." — Provérbios 31:25
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {route === 'contato' && (
          <div className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs uppercase tracking-widest text-rose-800 font-bold block mb-2">Atendimento</span>
                <h1 className="text-3xl font-extrabold text-slate-900 font-serif mb-4">Fale Conosco</h1>
                <p className="text-slate-600">Tem dúvidas sobre tamanhos, trocas ou frete? Nossa equipe de atendimento está pronta para te ajudar com todo carinho.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <span className="material-symbols-outlined text-rose-900 text-2xl">chat</span>
                    <div>
                      <h4 className="font-bold text-slate-900">WhatsApp de Atendimento</h4>
                      <p className="text-sm text-slate-600 mb-2">(11) 98765-4321</p>
                      <a 
                        href="https://wa.me/5511987654321"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-rose-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Iniciar conversa agora</span>
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <span className="material-symbols-outlined text-rose-900 text-2xl">mail</span>
                    <div>
                      <h4 className="font-bold text-slate-900">E-mail de Suporte</h4>
                      <p className="text-sm text-slate-600">contato@roupasmias.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                    <span className="material-symbols-outlined text-rose-900 text-2xl">schedule</span>
                    <div>
                      <h4 className="font-bold text-slate-900">Horário de Atendimento</h4>
                      <p className="text-sm text-slate-600">Segunda a Sexta: 09h às 18h</p>
                    </div>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Mensagem enviada com sucesso! Retornaremos em breve.');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Seu Nome</label>
                    <input type="text" required placeholder="Ex: Maria Silva" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-900 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Seu E-mail ou WhatsApp</label>
                    <input type="text" required placeholder="(11) 99999-9999" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-900 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Mensagem ou Dúvida</label>
                    <textarea rows={4} required placeholder="Qual peça você tem interesse?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-900 text-sm"></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-rose-900 text-white font-bold text-sm rounded-xl hover:bg-rose-800 transition-colors shadow-lg">
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-serif text-xl font-bold text-slate-900">Detalhes da Peça</h3>
              <button 
                onClick={() => { setProdutoSelecionado(null); setTamanhoSelecionado(''); }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs text-rose-800 font-semibold uppercase tracking-wider">{produtoSelecionado.categoria}</span>
                  <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">{produtoSelecionado.nome}</h2>
                  <p className="text-2xl font-extrabold text-slate-900 mb-4">
                    {produtoSelecionado.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{produtoSelecionado.descricao}</p>

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Escolha o Tamanho:</label>
                    <div className="flex flex-wrap gap-2">
                      {produtoSelecionado.tamanhos.map(t => (
                        <button
                          key={t}
                          onClick={() => setTamanhoSelecionado(t)}
                          className={`w-12 h-12 rounded-xl text-sm font-bold border transition-all ${
                            tamanhoSelecionado === t
                              ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-rose-900'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    adicionarAoCarrinho(produtoSelecionado, tamanhoSelecionado);
                    setProdutoSelecionado(null);
                    setTamanhoSelecionado('');
                  }}
                  className="w-full py-4 bg-rose-900 text-white font-bold text-sm rounded-xl hover:bg-rose-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span>Adicionar à Sacola</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Gaveta do Carrinho */}
      {isCarrinhoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-900">shopping_bag</span>
                <h3 className="font-serif text-xl font-bold text-slate-900">Sua Sacola ({qtdTotalItens})</h3>
              </div>
              <button 
                onClick={() => setIsCarrinhoOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {carrinho.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">remove_shopping_cart</span>
                  <p className="text-slate-600 font-medium mb-1">Sua sacola está vazia.</p>
                  <p className="text-xs text-slate-400">Explore nossa coleção e escolha suas peças favoritas.</p>
                </div>
              ) : (
                carrinho.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-center">
                    <img src={item.produto.imagem} alt={item.produto.nome} className="w-16 h-20 object-cover rounded-xl" />
                    <div className="flex-grow">
                      <h4 className="font-serif font-bold text-slate-900 text-sm">{item.produto.nome}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Tamanho: <span className="font-semibold text-slate-700">{item.tamanhoEscolhido}</span></p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-rose-900 text-sm">
                          {(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setCarrinho(prev => prev.map((it, i) => i === idx && it.quantidade > 1 ? { ...it, quantidade: it.quantidade - 1 } : it));
                            }}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold"
                          >-</button>
                          <span className="text-xs font-bold">{item.quantidade}</span>
                          <button 
                            onClick={() => {
                              setCarrinho(prev => prev.map((it, i) => i === idx ? { ...it, quantidade: it.quantidade + 1 } : it));
                            }}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-bold text-slate-900">{valorTotalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Frete</span>
                  <span className="font-bold text-emerald-600">{valorTotalCarrinho > 299 ? 'Grátis' : 'R$ 25,00'}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-rose-900">{(valorTotalCarrinho + (valorTotalCarrinho > 299 ? 0 : 25)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>

                <button 
                  onClick={() => {
                    alert('Pedido finalizado com sucesso! Redirecionando para o pagamento...');
                    setCarrinho([]);
                    setIsCarrinhoOpen(false);
                  }}
                  className="w-full py-4 bg-rose-900 text-white font-bold text-sm rounded-xl hover:bg-rose-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">lock</span>
                  <span>Finalizar Compra Segura</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 md:px-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-rose-900 text-white flex items-center justify-center font-serif font-bold">
                M
              </div>
              <span className="font-serif text-lg font-bold text-white">Roupas Mias</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Moda evangélica com elegância e sofisticação para mulheres virtuosas.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#/home" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#/colecao" className="hover:text-white transition-colors">Coleção Completa</a></li>
              <li><a href="#/sobre" className="hover:text-white transition-colors">Nossa Essência</a></li>
              <li><a href="#/contato" className="hover:text-white transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Categorias</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#/colecao" className="hover:text-white transition-colors">Vestidos Midi</a></li>
              <li><a href="#/colecao" className="hover:text-white transition-colors">Conjuntos Sociais</a></li>
              <li><a href="#/colecao" className="hover:text-white transition-colors">Saias Godê</a></li>
              <li><a href="#/colecao" className="hover:text-white transition-colors">Blusas e Camisas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">Receba novidades e cupons exclusivos em seu e-mail.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Seu e-mail" className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white w-full focus:outline-none focus:border-rose-700" />
              <button onClick={() => alert('Obrigada por se inscrever em nossa newsletter!')} className="px-4 py-2 bg-rose-900 text-white text-xs font-bold rounded-xl hover:bg-rose-800">Assinar</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; 2026 Roupas Mias. Todos os direitos reservados. Feito com elegância para mulheres de fé.</p>
        </div>
      </footer>
    </div>
  );
}
