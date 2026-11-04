# VS Code Sim

Editor (Monaco) + explorador + terminal simulado, no navegador.

## Uso
- **JavaScript e Python:** abra `index.html` direto no navegador (precisa de internet para carregar o Monaco e o Pyodide).
- **C, C++ e Java:** rode `node server.js` e abra http://localhost:3000 (precisa de gcc/g++/javac instalados).

## Atalhos
F5 ou Ctrl+Enter executa o arquivo aberto · Ctrl+S salva · ↑/↓ no terminal navega o histórico.
Digite `help` no terminal para ver os comandos.

## Atenção
O `server.js` executa código de verdade na sua máquina (só aceita conexões de localhost). Não o exponha na rede.
