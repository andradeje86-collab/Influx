import { defineConfig } from 'vite'

export default defineConfig({
  // Define o caminho base como o nome do seu repositório no GitHub
  base: '/Influx/', 
  
  build: {
    // Garante que o build seja gerado na pasta dist
    outDir: 'dist',
    // Limpa a pasta antes de gerar um novo build
    emptyOutDir: true,
  },
  
  server: {
    // Configuração opcional para facilitar o desenvolvimento local
    port: 3000,
    open: true
  }
})
