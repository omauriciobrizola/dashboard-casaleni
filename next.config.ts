import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build otimizado para Docker — gera pasta standalone com tudo necessário
  output: "standalone",
};

export default nextConfig;
