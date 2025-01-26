document.addEventListener('DOMContentLoaded', function () {
    // Carregar o conteúdo do sidebar.html no div do sidebarContainer
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebarContainer').innerHTML = data;

            // Adicionar evento de alternância do sidebar após o carregamento
            document.getElementById('toggleSidebar').addEventListener('click', function () {
                const sidebar = document.getElementById('sidebar');
                const sidebarText = document.querySelectorAll('.sidebar-text');
                const logoContainer = document.querySelector('.logo-container');

                // Alternar classes de minimização e expansão
                sidebar.classList.toggle('w-64'); // Expandido
                sidebar.classList.toggle('w-20'); // Minimizado
                sidebar.classList.toggle('sidebar-minimized');

                // Esconder ou mostrar texto dos itens e a logo
                sidebarText.forEach(text => text.classList.toggle('hidden'));
                if (logoContainer) {
                    logoContainer.classList.toggle('hidden');
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o sidebar:', error);
        });

    // Carregar o conteúdo do header.html no div do headerContainer
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('headerContainer').innerHTML = data;

            // Após carregar, inicializar funções do header
            fetchWeather(); // Função para buscar clima
            fetchCurrency(); // Função para buscar moeda
        })
        .catch(error => {
            console.error('Erro ao carregar o header:', error);
        });

    // Configurar a API de clima
    const apiKey = '3332e541016ef2b6b3a9602fea3cde6f';
    const city = 'Rio de Janeiro';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    // Função para buscar os dados do clima
    function fetchWeather() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const temperature = Math.round(data.main.temp); // Temperatura em Celsius
                    const iconCode = data.weather[0].icon; // Código do ícone
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL do ícone

                    // Atualizar o HTML
                    const weatherContainer = document.getElementById('weather');
                    if (weatherContainer) {
                        document.getElementById('weatherIcon').src = iconUrl;
                        document.getElementById('weatherIcon').classList.remove('hidden');
                        document.getElementById('temperature').textContent = `${temperature}°C`;
                        document.getElementById('temperature').classList.remove('hidden');
                        document.getElementById('location').textContent = `Rio,`;
                        document.getElementById('location').classList.remove('hidden');
                    }
                } else {
                    console.error('Erro ao buscar dados do clima:', data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao conectar à API do clima:', error);
            });
    }

    // Configurar a API de câmbio
    const currencyApiUrl = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL';

    function fetchCurrency() {
        fetch(currencyApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.USDBRL && data.EURBRL) {
                    // Dólar
                    const usdValue = parseFloat(data.USDBRL.bid).toFixed(2);
                    const usdVariation = parseFloat(data.USDBRL.varBid);
                    const usdIcon = document.getElementById('usdIcon');

                    document.getElementById('usdValue').textContent = `R$ ${usdValue}`;
                    document.getElementById('usd').classList.remove('hidden');

                    if (usdVariation > 0) {
                        usdIcon.className = 'fas fa-arrow-up text-green-500';
                        usdIcon.classList.remove('hidden');
                    } else {
                        usdIcon.className = 'fas fa-arrow-down text-red-500';
                        usdIcon.classList.remove('hidden');
                    }

                    // Euro
                    const eurValue = parseFloat(data.EURBRL.bid).toFixed(2);
                    const eurVariation = parseFloat(data.EURBRL.varBid);
                    const eurIcon = document.getElementById('eurIcon');

                    document.getElementById('eurValue').textContent = `R$ ${eurValue}`;
                    document.getElementById('eur').classList.remove('hidden');

                    if (eurVariation > 0) {
                        eurIcon.className = 'fas fa-arrow-up text-green-500';
                        eurIcon.classList.remove('hidden');
                    } else {
                        eurIcon.className = 'fas fa-arrow-down text-red-500';
                        eurIcon.classList.remove('hidden');
                    }
                } else {
                    console.error('Erro ao buscar dados de câmbio:', data);
                }
            })
            .catch(error => {
                console.error('Erro ao conectar à API de câmbio:', error);
            });
    }

    // Configurar a API do GitHub para listar repositórios
    const projectsContainer = document.getElementById('projectsContainer');
    const top3 = ['pong-invaders', 'linkin-park-project', 'fintech-java-app'];

    async function fetchRepositoriesTop() {
        try {
            const response = await fetch('/api/github');
            if (!response.ok) throw new Error('Erro ao buscar repositórios');

            const repos = await response.json();

            projectT3.innerHTML = ''; // Limpa os projetos existentes

            for (const repoName of top3) {
                const repo = repos.find((r) => r.name === repoName);

                if (repo) {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'bg-gray-800 p-4 rounded-lg project-card cursor-pointer hover:shadow-lg';
                    projectCard.onclick = () => {
                        window.open(repo.html_url, '_blank');
                    };

                    projectCard.innerHTML = `
                        <div class="relative w-full h-48 mb-4">
                            <img alt="Imagem do projeto ${repo.name}" class="w-full h-full object-cover rounded" src="https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/screenshot.png"/>
                        </div>
                        <h4 class="text-xl font-semibold mb-2">${repo.name}</h4>
                        <p>${repo.description || 'Sem descrição disponível'}</p>
                    `;

                    projectT3.appendChild(projectCard);
                }
            }
        } catch (error) {
            console.error('Erro ao conectar à API do GitHub:', error);
        }
    }

    // Chamar as funções necessárias
    fetchRepositoriesTop();
});
