document.addEventListener('DOMContentLoaded', function () {
    // Carregar o conteúdo do sidebar.html no div do sidebarContainer
    fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebarContainer').innerHTML = data;

        const toggleSidebar = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');
        const sidebarText = document.querySelectorAll('.sidebar-text');
        const logoContainer = document.querySelector('.logo-container');

        // Adicionar evento de alternância do sidebar
        toggleSidebar.addEventListener('click', function () {
            if (window.innerWidth > 768) {
                // Desktop: Expandir/minimizar
                sidebar.classList.toggle('w-64'); // Expandido
                sidebar.classList.toggle('w-20'); // Minimizado
                sidebar.classList.toggle('sidebar-minimized');

                sidebarText.forEach(text => text.classList.toggle('hidden'));
                if (logoContainer) {
                    logoContainer.classList.toggle('hidden');
                }
            } else {
                // Mobile: Mostrar/ocultar barra inferior
                sidebar.classList.toggle('hidden');
            }
        });

        // Ajustar a sidebar ao carregar a página
        function adjustSidebarForMobile() {
            if (window.innerWidth <= 768) {
                // Mobile: Ajustar para barra inferior
                sidebar.classList.add('fixed', 'bottom-0', 'w-full', 'h-auto', 'flex', 'justify-around', 'items-center', 'p-2');
                sidebar.classList.remove('w-64', 'h-full');
                sidebarText.forEach(text => text.classList.add('hidden')); // Esconde texto no mobile
                if (logoContainer) {
                    logoContainer.classList.add('hidden'); // Esconde logo no mobile
                }
            } else {
                // Desktop: Ajustar para barra lateral
                sidebar.classList.remove('fixed', 'bottom-0', 'w-full', 'h-auto', 'flex', 'justify-around', 'items-center', 'p-2');
                sidebar.classList.add('w-64', 'h-full');
                sidebarText.forEach(text => text.classList.remove('hidden')); // Mostra texto no desktop
                if (logoContainer) {
                    logoContainer.classList.remove('hidden'); // Mostra logo no desktop
                }
            }
        }

        // Executar ajuste no carregamento
        adjustSidebarForMobile();

        // Ajustar ao redimensionar a janela
        window.addEventListener('resize', adjustSidebarForMobile);
    })
    .catch(error => {
        console.error('Erro ao carregar o sidebar:', error);
    });



    // Configurar a API de clima
    function fetchWeather() {
        const apiKey = '3332e541016ef2b6b3a9602fea3cde6f';
        const city = 'Rio de Janeiro';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const temperature = Math.round(data.main.temp);
                    const iconCode = data.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    document.getElementById('weatherIcon').src = iconUrl;
                    document.getElementById('weatherIcon').classList.remove('hidden');
                    document.getElementById('temperature').textContent = `${temperature}°C`;
                    document.getElementById('temperature').classList.remove('hidden');
                    document.getElementById('location').textContent = `Rio,`;
                    document.getElementById('location').classList.remove('hidden');
                } else {
                    console.error('Erro ao buscar dados do clima:', data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao conectar à API do clima:', error);
            });
    }

    function fetchCurrency() {
        const currencyApiUrl = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL';

        fetch(currencyApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.USDBRL && data.EURBRL) {
                    const usdValue = parseFloat(data.USDBRL.bid).toFixed(2);
                    const usdVariation = parseFloat(data.USDBRL.varBid);
                    const usdIcon = document.getElementById('usdIcon');
                    document.getElementById('usdValue').textContent = `R$ ${usdValue}`;
                    document.getElementById('usd').classList.remove('hidden');
                    usdIcon.className = usdVariation > 0 ? 'fas fa-arrow-up text-green-500' : 'fas fa-arrow-down text-red-500';
                    usdIcon.classList.remove('hidden');

                    const eurValue = parseFloat(data.EURBRL.bid).toFixed(2);
                    const eurVariation = parseFloat(data.EURBRL.varBid);
                    const eurIcon = document.getElementById('eurIcon');
                    document.getElementById('eurValue').textContent = `R$ ${eurValue}`;
                    document.getElementById('eur').classList.remove('hidden');
                    eurIcon.className = eurVariation > 0 ? 'fas fa-arrow-up text-green-500' : 'fas fa-arrow-down text-red-500';
                    eurIcon.classList.remove('hidden');
                }
            })
            .catch(error => console.error('Erro ao conectar à API de câmbio:', error));
    }

    const projectsContainer = document.getElementById('projectsContainer');
    const projectT3 = document.getElementById('projectT3');

    // Lista de repositórios vetados
    const vetado = ['Diogobitten', 'readme-jokes', 'snk', 'rafaballerini', 'ABSphreak'];
    const top3 = ['pong-invaders', 'linkin-park-project', 'fintech-java-app'];

    // Extrair URLs de imagens ou vídeos do README
    function extractMediaLinks(owner, repo, readmeContent) {
        const mediaRegex = /!\[.*?\]\((.*?)\)/g; // Regex para capturar links de mídia no README
        const matches = [...readmeContent.matchAll(mediaRegex)];

        return matches.map(match => {
            const relativePath = match[1];
            if (!relativePath.startsWith('http')) {
                return `https://raw.githubusercontent.com/${owner}/${repo}/main/${relativePath}`;
            }
            return relativePath; // Retornar links absolutos
        });
    }

    // Função para buscar os repositórios utilizando o proxy `/api/github`
    async function fetchRepositories() {
        try {
            const response = await fetch('/api/github');
            if (!response.ok) throw new Error('Erro ao buscar repositórios');
            const repos = await response.json();
            projectsContainer.innerHTML = '';

            for (const repo of repos) {
                if (vetado.includes(repo.name)) {
                    console.warn(`Repositório ${repo.name} está na lista de exceção e será ignorado.`);
                    continue;
                }

                const readmeResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`);
                if (!readmeResponse.ok) continue;
                const readmeData = await readmeResponse.json();
                const decodedReadme = atob(readmeData.content);
                const mediaLinks = extractMediaLinks(repo.owner.login, repo.name, decodedReadme);

                const projectCard = document.createElement('div');
                projectCard.className = 'bg-gray-800 p-4 rounded-lg project-card cursor-pointer hover:shadow-lg';
                projectCard.onclick = () => window.open(repo.html_url, '_blank');

                projectCard.innerHTML = `
                    <div class="relative w-full h-48 mb-4">
                        ${
                            mediaLinks.length > 0
                                ? mediaLinks[0].endsWith('.mp4')
                                    ? `<video class="w-full h-full object-cover rounded" controls>
                                          <source src="${mediaLinks[0]}" type="video/mp4">
                                          Seu navegador não suporta o vídeo.
                                      </video>`
                                    : `<img alt="Imagem do projeto ${repo.name}" class="w-full h-full object-cover rounded" src="${mediaLinks[0]}"/>`
                                : '<div class="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">Sem mídia</div>'
                        }
                    </div>
                    <h4 class="text-xl font-semibold mb-2">${repo.name}</h4>
                    <p>${repo.description || 'Sem descrição disponível'}</p>
                `;

                projectsContainer.appendChild(projectCard);
            }
        } catch (error) {
            console.error('Erro ao conectar à API do GitHub:', error);
        }
    }

    async function fetchRepositoriesTop() {
        try {
            const response = await fetch('/api/github');
            if (!response.ok) throw new Error('Erro ao buscar repositórios');
            const repos = await response.json();

            projectT3.innerHTML = '';

            for (const repoName of top3) {
                const repo = repos.find(r => r.name === repoName);
                if (repo) {
                    const readmeResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`);
                    if (!readmeResponse.ok) continue;
                    const readmeData = await readmeResponse.json();
                    const decodedReadme = atob(readmeData.content);
                    const mediaLinks = extractMediaLinks(repo.owner.login, repo.name, decodedReadme);

                    const projectCard = document.createElement('div');
                    projectCard.className = 'bg-gray-800 p-4 rounded-lg project-card cursor-pointer hover:shadow-lg';
                    projectCard.onclick = () => window.open(repo.html_url, '_blank');

                    projectCard.innerHTML = `
                        <div class="relative w-full h-48 mb-4">
                            ${
                                mediaLinks.length > 0
                                    ? mediaLinks[0].endsWith('.mp4')
                                        ? `<video class="w-full h-full object-cover rounded" controls>
                                              <source src="${mediaLinks[0]}" type="video/mp4">
                                              Seu navegador não suporta o vídeo.
                                          </video>`
                                        : `<img alt="Imagem do projeto ${repo.name}" class="w-full h-full object-cover rounded" src="${mediaLinks[0]}"/>`
                                    : '<div class="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">Sem mídia</div>'
                            }
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

    fetchWeather();
    fetchCurrency();
    fetchRepositories();
    fetchRepositoriesTop();
});
