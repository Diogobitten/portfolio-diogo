document.addEventListener('DOMContentLoaded', function () {
    // Carregar o conteúdo do sidebar.html no div do sidebarContainer
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebarContainer').innerHTML = data;

            // Inicia o sidebar minimizado
            const sidebar = document.getElementById('sidebar');
            const sidebarText = document.querySelectorAll('.sidebar-text');
            const logoContainer = document.querySelector('.logo-container');

            sidebar.classList.add('w-20', 'sidebar-minimized');
            sidebarText.forEach(text => text.classList.add('hidden'));
            if (logoContainer) {
                logoContainer.classList.add('hidden');
            }

            // Adicionar evento de alternância do sidebar
            document.getElementById('toggleSidebar').addEventListener('click', function () {
                sidebar.classList.toggle('w-64'); // Expandido
                sidebar.classList.toggle('w-20'); // Minimizado
                sidebar.classList.toggle('sidebar-minimized');

                sidebarText.forEach(text => text.classList.toggle('hidden'));
                if (logoContainer) {
                    logoContainer.classList.toggle('hidden');
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o sidebar:', error);
        });

    // Chatbot
    const chatbotButton = document.getElementById('chatbotButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const faqButtonsContainer = document.getElementById('faqButtons');
    const welcomeMessage = document.getElementById('welcomeMessage');
    let currentAnswer = null;
  
    // Todas as perguntas do FAQ
    const allQuestions = [
      'Qual é a sua formação acadêmica?',
      'Quais projetos você já desenvolveu?',
      'Quais são suas principais habilidades técnicas?',
      'Qual foi a sua experiência mais recente?',
      'Como você combina design e tecnologia?',
      'Qual é o seu objetivo profissional atual?'
    ];
  
    // Respostas do FAQ
    const faqAnswers = {
      'Qual é a sua formação acadêmica?': `
        Sou estudante de <strong>Análise e Desenvolvimento de Sistemas</strong> na FIAP, com conclusão prevista para <strong>2025</strong>. 
        Também sou graduado em <strong>Publicidade e Propaganda</strong> pelo IBMR.
      `,
      'Quais projetos você já desenvolveu?': `
        Já desenvolvi projetos como:
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Fintech:</strong> Aplicação web focada em gerenciamento financeiro pessoal.</li>
          <li><strong>iFood Challenger:</strong> Sistema para alocação de recursos para parceiros do iFood.</li>
          <li><strong>SmartCondo:</strong> Projeto focado em sustentabilidade e eficiência energética.</li>
          <li><strong>Linkin Park Project:</strong> Um site interativo desenvolvido com React.</li>
          <li><strong>Pong Invaders:</strong> Um jogo que une os clássicos Pong e Space Invaders, desenvolvido em JavaScript.</li>
          <li><strong>Fala Série!:</strong> Um podcast sobre filmes e séries, acompanhado de um site criado com HTML e CSS.</li>
        </ul>
      `,
      'Quais são suas principais habilidades técnicas?': `
        Minhas principais habilidades incluem:
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Front-end:</strong> HTML, CSS, JavaScript, React, Bootstrap.</li>
          <li><strong>Back-end:</strong> Python, Java, Banco de Dados Oracle.</li>
          <li><strong>Outros:</strong> AWS, UX/UI Design, conhecimentos avançados em Design Gráfico.</li>
        </ul>
      `,
      'Qual foi a sua experiência mais recente?': `
        Trabalhei como <strong>Diretor de Arte</strong> na Beonne, na Flórida, onde desenvolvi:
        <ul class="list-disc pl-5 space-y-2">
          <li>Layouts e soluções para e-commerce.</li>
          <li>Conteúdo visual para marcas no Amazon Seller Central.</li>
        </ul>
      `,
      'Como você combina design e tecnologia?': `
        Minha formação em <strong>Publicidade e UX/UI</strong>, junto com minhas habilidades técnicas, 
        permite que eu crie soluções inovadoras e centradas no usuário, combinando criatividade e funcionalidade.
      `,
      'Qual é o seu objetivo profissional atual?': `
        Estou em busca de um <strong>estágio como Desenvolvedor Full Stack</strong>, onde eu possa aplicar minhas habilidades técnicas em projetos desafiadores, 
        colaborar em equipe e continuar aprendendo sobre desenvolvimento web, cloud computing e bancos de dados.
      `
    };
  
    // Função para embaralhar perguntas
    const shuffleArray = (array) => {
      const shuffled = array.slice(); // Faz uma cópia do array original
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
  
    // Função para exibir perguntas aleatórias
    const showRandomQuestions = () => {
      const randomQuestions = shuffleArray(allQuestions).slice(0, 3); // Seleciona 3 perguntas aleatórias
      faqButtonsContainer.innerHTML = ''; // Limpa perguntas anteriores
  
      randomQuestions.forEach((question) => {
        const button = document.createElement('button');
        button.className = 'faq-button text-right';
        button.textContent = question;
        faqButtonsContainer.appendChild(button);
  
        // Evento de clique para exibir resposta
        button.addEventListener('click', () => {
          if (currentAnswer) {
            currentAnswer.remove();
          }
  
          currentAnswer = document.createElement('div');
          currentAnswer.className = 'text-sm text-white bg-gray-600 p-2 rounded-lg';
          currentAnswer.innerHTML = faqAnswers[question];
          chatMessages.appendChild(currentAnswer);
  
          // Scroll automático para o final do chat
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      });
  
      addMoreQuestionsBalloon(); // Adiciona o balão "Confira mais perguntas"
    };
  
    // Função para exibir todas as perguntas no chat
    const showAllQuestions = () => {
      faqButtonsContainer.innerHTML = ''; // Limpa perguntas anteriores
  
      allQuestions.forEach((question) => {
        const button = document.createElement('button');
        button.className = 'faq-button text-right';
        button.textContent = question;
        faqButtonsContainer.appendChild(button);
  
        // Evento de clique para exibir resposta
        button.addEventListener('click', () => {
          if (currentAnswer) {
            currentAnswer.remove();
          }
  
          currentAnswer = document.createElement('div');
          currentAnswer.className = 'text-sm text-white bg-gray-600 p-2 rounded-lg';
          currentAnswer.innerHTML = faqAnswers[question];
          chatMessages.appendChild(currentAnswer);
  
          // Scroll automático para o final do chat
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      });
    };
  
    // Função para adicionar o balão "Confira mais perguntas"
    const addMoreQuestionsBalloon = () => {
      // Remove o balão existente antes de adicionar um novo
      const existingBalloon = document.querySelector('.more-questions-balloon');
      if (existingBalloon) {
        existingBalloon.remove();
      }
  
      const moreQuestionsBalloon = document.createElement('div');
      moreQuestionsBalloon.className = 'more-questions-balloon text-sm text-blue-500 bg-gray-800 p-2 rounded-lg cursor-pointer mt-2';
      moreQuestionsBalloon.textContent = 'Confira mais perguntas 👇';
  
      // Evento de clique para exibir todas as perguntas
      moreQuestionsBalloon.addEventListener('click', () => {
        showAllQuestions(); // Exibe todas as perguntas
        moreQuestionsBalloon.remove(); // Remove o balão após clicar
      });
  
      chatMessages.appendChild(moreQuestionsBalloon); // Adiciona o balão no chat
    };
  
    // Função para reiniciar o chat
    const resetChat = () => {
      welcomeMessage.classList.remove('hidden'); // Mostra a mensagem inicial
      faqButtonsContainer.innerHTML = ''; // Limpa perguntas anteriores
      showRandomQuestions(); // Exibe 3 perguntas aleatórias
    };
  
    // Evento para abrir/fechar o chatbot
    chatbotButton.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      if (!chatWindow.classList.contains('hidden')) {
        resetChat(); // Reinicia o chat ao abrir
      }
    });
  
    // Evento para fechar o chatbot
    closeChat.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
    });

    // Mostrar balãozinho inicial após 3 segundos
    setTimeout(() => {
        const chatTooltip = document.getElementById('chatTooltip');
        chatTooltip.classList.remove('hidden');
        setTimeout(() => {
            chatTooltip.classList.add('hidden'); // Esconde o balãozinho após 7 segundos
        }, 7000);
    }, 3000);

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

    // Configurar a API de câmbio
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

    // Buscar repositórios do GitHub
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

    // Buscar repositórios top 3
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

    // Inicialização
    fetchWeather();
    fetchCurrency();
    fetchRepositories();
    fetchRepositoriesTop();
});