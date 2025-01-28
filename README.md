# Portfolio de Diogo Bittencourt

Este é o projeto do meu portfólio pessoal, onde apresento meus principais trabalhos, experiências e habilidades. O site foi desenvolvido utilizando HTML, CSS, JavaScript e a biblioteca TailwindCSS.

## Live Demo

![Portfólio Diogo Bittencourt](img/portfolio.gif)

## Funcionalidades

- **Sidebar Dinâmica**: Sidebar responsiva que se expande ou minimiza com efeito suave.
- **Consulta de APIs**:
  - **Repositórios do GitHub**: Utiliza a API do GitHub para listar os meus principais repositórios, exibindo imagens ou vídeos presentes nos       README dos projetos.
  - **Clima**: Consulta a API do OpenWeather para mostrar a temperatura atual do Rio de Janeiro.
  - **Cotação de Moedas**: Consulta a API da AwesomeAPI para exibir a cotação atual do USD e EUR em relação ao Real (BRL).

## Tecnologias Utilizadas

- **HTML5**
- **CSS3** (com TailwindCSS)
- **JavaScript**
- **Font Awesome** (para ícones)
- **Chatbot**
- **APIs Externas**: OpenWeather, AwesomeAPI, GitHub API

## Como Esconder a Chave de API

Para garantir a segurança e privacidade dos dados, as chaves de API são armazenadas em variáveis de ambiente, utilizando o seguinte código no backend:

```javascript
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
};
```

No seu ambiente de desenvolvimento, crie um arquivo `.env` e adicione a chave de API:

```
GITHUB_API_KEY=seu_token_aqui
```

**Nota**: Certifique-se de que o arquivo `.env` não seja versionado, adicionando-o ao seu `.gitignore`.

## Como Executar o Projeto

1. Clone este repositório:
   ```sh
   git clone https://github.com/Diogobitten/portfolio-diogo.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure suas variáveis de ambiente no arquivo `.env`.
4. Inicie o servidor de desenvolvimento:
   ```sh
   npm start
   ```
5. Acesse o projeto no navegador através do endereço [http://localhost:3000](http://localhost:3000).

## Contato

- [LinkedIn](https://www.linkedin.com/in/diogo-bittencourt-de-oliveira/)
- [GitHub](https://github.com/Diogobitten)

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais informações.

---

Sinta-se à vontade para explorar os projetos e entrar em contato!
