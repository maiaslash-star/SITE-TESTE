# 🚀 CABO DEYVISON — Guia de Deploy

## Estrutura de Pastas

```
cabodeyvison.com.br/
├── index.html
├── style.css
├── main.js
├── images/
│   ├── cabo-deyvison.jpg   ← foto do candidato (3:4, mín 800x1067px)
│   ├── mossoro-igreja.jpg  ← foto da cidade (16:9, mín 1200x675px)
│   ├── mossoro-teatro.jpg  ← foto da cidade (16:9, mín 1200x675px)
│   └── mossoro-praca.jpg   ← foto da cidade (16:9, mín 1200x675px)
├── denuncia/
│   └── index.html          ← página de denúncia (existente)
└── jogos/
    └── index.html          ← página de jogos (existente)
```

---

## ✅ Checklist de Deploy

### 1. Fazer upload dos arquivos
Envie via FTP/cPanel/SSH os 3 arquivos para a raiz do site:
- `index.html`
- `style.css`
- `main.js`

### 2. Verificar as imagens
As imagens já existem no seu servidor em `/images/`. Confirme que os nomes batem:
- `cabo-deyvison.jpg`
- `mossoro-igreja.jpg`
- `mossoro-teatro.jpg`
- `mossoro-praca.jpg`

Se os nomes forem diferentes, edite o `index.html` e troque nos atributos `src=""`.

### 3. Testar no navegador
Acesse `https://cabodeyvison.com.br` e verifique:
- [ ] Loader animado aparece e some
- [ ] Partículas 3D no hero funcionam
- [ ] Cursor personalizado aparece (desktop)
- [ ] Acordeão de propostas abre/fecha
- [ ] Contadores animam ao rolar
- [ ] Menu mobile funciona
- [ ] Formulário de contato envia

---

## ⚙️ Personalizações Rápidas

### Trocar cor principal (laranja → outra cor)
Em `style.css`, linha 17:
```css
--accent: #f97316;   /* troque este valor */
--accent-2: #fb923c; /* versão mais clara */
```

### Atualizar números do dashboard
Em `index.html`, procure `data-count`:
```html
<span class="dash-num" data-count="2547">0</span>  <!-- total denúncias -->
<span class="dash-num" data-count="87">...          <!-- taxa resolução -->
<span class="dash-num" data-count="32">...          <!-- bairros -->
```

### Atualizar estatísticas do hero
```html
<span class="stat-num" data-count="170">  <!-- R$ fiscalizados (M) -->
<span class="stat-num" data-count="100">  <!-- famílias ajudadas -->
<span class="stat-num" data-count="14">   <!-- casos documentados -->
```

### Adicionar novo caso na timeline
Copie este bloco dentro de `<div class="timeline">`:
```html
<div class="timeline-item resolved reveal-slide">
  <div class="tl-indicator">
    <span class="tl-dot"></span>
    <span class="tl-status">Resolvido</span>
  </div>
  <div class="tl-content">
    <span class="tl-cat">Categoria</span>
    <h4>Título do Caso</h4>
    <p>Descrição breve do caso e resultado.</p>
  </div>
</div>
```
Status disponíveis: `resolved` (verde) · `ongoing` (amarelo) · `pending` (cinza)

### Adicionar nova proposta
Copie um bloco `.proposta-item` e edite número, tipo (PEC/PL), título e conteúdo.

---

## 📱 Performance

O site já está otimizado:
- Imagens com `loading="lazy"`
- Canvas WebGL só inicia após o loader
- Pixel ratio limitado a 2x
- Scroll listeners com `passive: true`
- IntersectionObserver para animações (sem scroll contínuo)

Para melhorar ainda mais, comprima as imagens em:
👉 https://squoosh.app (gratuito, sem limite)
- Formato: WebP
- Qualidade: 80%
- Largura máxima: 1200px

---

## 🌐 Formulário de Contato

O formulário atualmente mostra apenas uma confirmação visual.
Para receber os dados por e-mail, integre com um destes serviços gratuitos:

**Opção 1 — Formspree (mais fácil)**
1. Acesse formspree.io e crie conta
2. Crie um formulário novo
3. No `index.html`, mude a tag form:
```html
<form class="contato-form" id="contatoForm" 
      action="https://formspree.io/f/SEU_ID" method="POST">
```
4. Remova o `e.preventDefault()` no `main.js` dentro de `initForm()`

**Opção 2 — WhatsApp direto**
Substitua o submit por um link:
```html
<a href="https://wa.me/5584996981813?text=Quero+que+você+visite+minha+cidade!" 
   class="btn-primary full">
```

---

## 🔒 SEO & Meta Tags

Já configurado no `<head>` do `index.html`:
- Title otimizado
- Meta description
- Open Graph (compartilhamento no WhatsApp/Facebook)
- Twitter Card
- Theme color

Para adicionar foto de compartilhamento (og:image):
```html
<meta property="og:image" content="https://cabodeyvison.com.br/images/og-cover.jpg" />
```
Crie uma imagem `og-cover.jpg` de **1200×630px** com foto + logo.

---

## 📞 Suporte

Qualquer dúvida no deploy, chame no WhatsApp:
**Arquivo gerado por IA · cabodeyvison.com.br · 2026**
