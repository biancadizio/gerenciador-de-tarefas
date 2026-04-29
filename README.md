# Gerenciador de tarefas

![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Aplicativo de lista de tarefas moderno com dark mode, integração com API e persistência de dados, desenvolvido com React Native e Expo.

![Screenshot da Aplicação](screenshot.png) <!-- Adicione uma screenshot real depois -->

## ✨ Funcionalidades

- ✅ Adicionar novas tarefas
- ✔️ Marcar/desmarcar tarefas como concluídas
- 🗑️ Excluir tarefas
- 🌙 Dark mode moderno (tema cyberpunk)
- 📱 Offline-first com AsyncStorage
- 🌐 Integração com API pública (JSONPlaceholder)
- 🔄 Sincronização automática
- 📲 Compatível com iOS, Android e Web

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v18+)
- npm (v9+)
- Expo CLI (`npm install -g expo-cli`)

### Instalação

1. Clone o repositório:

git clone https://github.com/biancadizio/lista-de-tarefas.git

cd lista-de-tarefas

2. Instale as dependências:

npm install

3. Inicie o servidor de desenvolvimento:

npx expo start

📱 No Celular

    Instale o app Expo Go (Android / iOS)

    Escaneie o QR code exibido no terminal

💻 No Computador

Para web:

npx expo start --web

Para emulador:

# Android
npx expo run:android

# iOS (requer Xcode)
npx expo run:ios

🛠 Tecnologias

    React Native

    Expo

    TypeScript

    AsyncStorage

    Axios

    React Navigation

    JSONPlaceholder API

🌐 Deployment
Opção 1: Expo Hosting (Recomendado)

expo publish

Acesse via: https://expo.dev/@seu-usuario/lista-de-tarefas

Opção 2: Web Estático (Vercel/Netlify)

npx expo export:web

Deploy da pasta web-build

Opção 3: App Stores (EAS Build)

npm install -g eas-cli
eas build:configure
eas build --platform all

📄 Licença

MIT License - veja o arquivo LICENSE para detalhes

Desenvolvido por [Bianca Gonçalves Dizio] - Portfólio | LinkedIn


## Sugestões de Deploy:

1. **Expo Hosting (Mais simples)**
   - Execute `expo publish`
   - Disponível em: `https://expo.dev/@your-username/your-app`
   - Compartilhe o link diretamente

2. **Android Play Store / Apple App Store**
   - Use EAS Build: `eas build --platform android|ios`
   - Siga o guia oficial: [Expo Deployment Docs](https://docs.expo.dev/distribution/app-stores/)

3. **Web Estático**
   - Gere build web: `npx expo export:web`
   - Deploy na Vercel/Netlify:

     npm install -g vercel
     vercel deploy --prod web-build


4. **APK Android Autônomo**

   npx expo run:android

O APK será gerado em android/app/build/outputs/apk/debug
