export default async function handler(req, res) {
    // Adicione os cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Verifica se é uma requisição GET
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    // Variáveis
    const city = req.query.city || 'Rio de Janeiro';
    const apiKey = process.env.OPENWEATHER_API_KEY; // A chave da API está protegida aqui
  
    // URL da API do OpenWeather
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
  
    try {
      // Faz a requisição para a API do OpenWeather
      const response = await fetch(WEATHER_API_URL);
      const data = await response.json();
  
      // Retorna os dados da API para o front-end
      res.status(200).json(data);
    } catch (error) {
      console.error('Erro ao conectar à API do OpenWeather:', error);
      res.status(500).json({ error: 'Erro ao conectar à API do OpenWeather' });
    }
  }
  