# Studio Atitude — Gestão de Demandas

Ferramenta interna com login, cargos e kanban de demandas de design.

## Acesso inicial (Admin)

```
E-mail: admin@studio.com
Senha:  admin123
```

> Troque a senha no painel de usuários após o primeiro acesso.

## Cargos

| Cargo | Permissões |
|---|---|
| **Admin** | Cadastra e gerencia usuários, vê e edita todas as demandas |
| **Solicitante** | Cria demandas e direciona para um designer específico |
| **Designer** | Vê apenas as demandas atribuídas a ele |

## Deploy (GitHub + Vercel)

1. Crie um repositório no GitHub e suba os arquivos `index.html` e `logo.png`
2. Acesse [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo → **Deploy**

Pronto — URL pública em menos de 1 minuto.

## Estrutura

```
studio-atitude/
├── index.html   # App completo
├── logo.png     # Logo
└── README.md
```

Os dados ficam salvos no `localStorage` do navegador de cada usuário.
