import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Đọc báo",
        short_name: "Đọc báo",
        theme_color: "#fff",
        background_color: "#fff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        id: "/",
        icons: [
          {
            src: "images/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "images/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "images/screenshot-mobile.png",
            sizes: "454x802",
            type: "image/png",
            form_factor: "narrow",
            label: "Đọc báo",
          },
          {
            src: "images/screenshot.png",
            sizes: "1133x937",
            type: "image/png",
            form_factor: "wide",
            label: "Đọc báo",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
    react(),
    vercel(),
  ],
});
