// next-i18next.config.js
module.exports = {
  i18n: {
    // Idioma padrão quando o idioma do navegador não é encontrado
    defaultLocale: 'en',

    // Idiomas suportados no seu projeto
    locales: ['en', 'pt'] // Adicione outros idiomas conforme necessário
  },

  // Caminho para os arquivos de tradução
  localePath: './public/locales' // Atualize conforme a estrutura de diretórios do seu projeto
};
