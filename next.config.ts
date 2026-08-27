import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o servidor de dev por outros hosts na rede local
  // (ex: http://192.168.1.19:3000 além de localhost:3000). Sem isso, o
  // Next.js bloqueia por segurança as requisições cross-origin em dev —
  // a UI carrega mas fica sem interatividade e sem dados.
  // Adicione outros IPs/hosts da sua rede aqui se precisar acessar de mais
  // dispositivos.
  allowedDevOrigins: ["192.168.1.19"],
};

export default nextConfig;
