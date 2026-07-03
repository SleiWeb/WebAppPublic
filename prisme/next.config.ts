import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Repoet indeholder også den gamle Vite-prototype i roden — lås
  // workspace-roden til denne app, så Turbopack ikke gætter forkert.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
