import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite as imagens do Supabase Storage (qualquer projeto *.supabase.co).
    // Sem isso, o otimizador do next/image responde 400 e nada renderiza.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
