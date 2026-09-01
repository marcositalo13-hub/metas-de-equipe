# Metas da Equipe

Webapp de página única para registrar metas batidas por Marcos, Amanda e Geovana. Calendário
mensal com marcações "M" (laranja) e "S" (vermelho) por pessoa, confete ao bater meta, e
gráficos de evolução mensal no ano corrente.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`, acesso direto pelo client, sem autenticação) — banco,
  Storage e Realtime (sincronização entre aparelhos)
- Recharts (gráficos)
- Framer Motion (animações)
- canvas-confetti (comemoração ao bater meta)

## Rodando localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o `.env.local` (veja a seção abaixo) com a URL e a chave anônima do seu projeto
   Supabase.

3. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000).

Se as variáveis do Supabase não estiverem preenchidas, o app sobe normalmente e mostra uma
tela avisando que a configuração está pendente — o build não quebra.

## Aplicando o schema no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o **SQL Editor** do projeto.
3. Cole e execute o conteúdo de [`supabase/schema.sql`](./supabase/schema.sql).

O script cria a tabela `metas` (com a constraint única `pessoa + tipo + data` e índice em
`data`), habilita Row Level Security e libera `select`/`insert`/`delete` para o papel `anon`.
Isso é intencional: é uma ferramenta interna sem login, então o acesso anônimo é o esperado
(há um comentário avisando isso no próprio SQL). Não use este schema como está para dados
sensíveis expostos publicamente.

4. Cole e execute também o conteúdo de [`supabase/storage-policies.sql`](./supabase/storage-policies.sql)
   — cria o bucket `fotos` (público) usado para as fotos de perfil e libera leitura pública e
   upload/atualização para o papel `anon`, pelo mesmo motivo acima.
5. Cole e execute também o conteúdo de [`supabase/realtime-setup.sql`](./supabase/realtime-setup.sql)
   — habilita o Supabase Realtime na tabela `metas`, para que uma marcação feita em um aparelho
   apareça automaticamente nos outros. Em projetos novos do Supabase isso costuma já vir
   habilitado por padrão; o script é idempotente (não dá erro se já estiver habilitado). Sem
   esse passo o app continua funcionando normalmente, só que sem sincronizar em tempo real
   entre aparelhos — só ao recarregar a página.

## Variáveis de ambiente

Preencha `.env.local` (nunca versionado) com os valores encontrados em **Project Settings →
API** no painel do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Use `.env.local.example` como referência do formato esperado.

## Configurando na Vercel

No painel do projeto na Vercel, em **Settings → Environment Variables**, adicione:

| Nome                            | Valor                                  |
| -------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | URL do seu projeto Supabase             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Chave anônima (`anon public`) do Supabase |

Depois disso, faça o deploy normalmente (`vercel` ou via integração com o Git).

## Fotos da equipe

As fotos de perfil são enviadas pelo próprio app: clique no ícone de câmera sobre o avatar de
uma pessoa, no seletor do topo, para tirar/escolher uma foto. A imagem é redimensionada e
comprimida no navegador (máx. 500x500px) e enviada para o bucket `fotos` no Supabase Storage
(nome fixo `<pessoa>.jpg`, sobrescrevendo a foto anterior). Enquanto a pessoa não tiver foto —
ou se o Supabase Storage não estiver configurado/acessível — o app usa automaticamente um
placeholder SVG com as iniciais dela.

## Build de produção

```bash
npm run build
npm start
```
