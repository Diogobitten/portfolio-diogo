export default async function handler(req, res) {

  
 // Adicione os cabeçalhos CORS
 res.setHeader('Access-Control-Allow-Origin', '*'); // Permite acesso de qualquer origem
 res.setHeader('Access-Control-Allow-Methods', 'GET'); // Permite apenas requisições GET
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


  // Configure a URL para a API do GitHub
  const githubUsername = 'Diogobitten'; 
  const GITHUB_API_URL = `https://api.github.com/users/${githubUsername}/repos`;

  // Headers para autenticação e outros
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
  };

  try {
    // Faça a requisição para a API do GitHub
    const response = await fetch(GITHUB_API_URL, { headers });
    const data = await response.json();


    // Retorne os dados da API do GitHub
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao conectar à API do GitHub' });
  }
}