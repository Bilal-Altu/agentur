import type { NextConfig } from "next";

// Auf GitHub Pages liegt die Seite unter /<repo>/ — der Pfad kommt aus dem CI-Workflow
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
};

export default nextConfig;
