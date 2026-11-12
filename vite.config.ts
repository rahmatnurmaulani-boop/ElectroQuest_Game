import {defineConfig} from 'vite';
export default defineConfig({
  base:'./',
  server:{host:'127.0.0.1',port:5173},
  preview:{host:'127.0.0.1',port:4177},
  build:{rollupOptions:{input:{main:'index.html',uiGallery:'ui-gallery.html',consoleGallery:'console-gallery.html'}}},
});
