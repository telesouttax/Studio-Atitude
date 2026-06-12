# Studio Atitude — Gestão de Demandas

Ferramenta interna de gestão de demandas de design da igreja.

## Como subir no GitHub + Vercel

### 1. GitHub
1. Crie um repositório novo em [github.com](https://github.com/new)
2. Nomeie como `studio-atitude` (pode ser privado)
3. Faça upload dos arquivos: `index.html` e `logo.png`

### 2. Vercel
1. Acesse [vercel.com](https://vercel.com) → **Add New → Project**
2. Conecte sua conta GitHub e importe o repositório `studio-atitude`
3. Clique em **Deploy** — pronto

O site vai estar no ar em menos de 1 minuto com uma URL pública.

## Estrutura

```
studio-atitude/
├── index.html   # Ferramenta completa (kanban + modal)
├── logo.png     # Logo do Studio Atitude
└── README.md
```

## Recursos da ferramenta

- Kanban com 3 colunas: Solicitado → Em progresso → Entregue
- Campo de solicitante com avatar de iniciais
- Prioridade (Normal / Urgente)
- Prazo com alerta de vencimento
- Filtro por tipo de arte
- Busca por título ou solicitante
- Dados salvos no navegador (localStorage)
- Atalho: `Cmd+Enter` para salvar; `Esc` para fechar modal
- 100% responsivo para mobile
