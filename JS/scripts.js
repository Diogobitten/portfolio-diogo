const API_URL = "https://chatbot-izuj.onrender.com/chat"; 

document.addEventListener('DOMContentLoaded', function () {
    fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebarContainer').innerHTML = data;

        // Configuração inicial da sidebar minimizada
        const sidebar = document.getElementById('sidebar');
        const sidebarText = document.querySelectorAll('.sidebar-text');
        const logoContainer = document.querySelector('.logo-container');

        sidebar.classList.add('w-20', 'sidebar-minimized');
        sidebarText.forEach(text => text.classList.add('hidden'));
        if (logoContainer) {
            logoContainer.classList.add('hidden');
        }

        // Alternar sidebar minimizada
        document.getElementById('toggleSidebar').addEventListener('click', function () {
            sidebar.classList.toggle('w-64'); // Expandido
            sidebar.classList.toggle('w-20'); // Minimizado
            sidebar.classList.toggle('sidebar-minimized');

            sidebarText.forEach(text => text.classList.toggle('hidden'));
            if (logoContainer) {
                logoContainer.classList.toggle('hidden');
            }

            // Ajustar o botão de idioma ao minimizar a sidebar
            adjustLanguageButton();
        });

        // ⚠️ Configura os eventos do botão de idioma
        setupLanguageSwitcher();
        adjustLanguageButton(); // Aplicar ajuste inicial
    })
    .catch(error => console.error('Erro ao carregar o sidebar:', error));

// Configurar troca de idioma e tradução automática
function setupLanguageSwitcher() {
    const languageButton = document.getElementById('languageButton');
    const languageOptions = document.getElementById('languageOptions');
    const languageButtons = document.querySelectorAll('.language-option');
    const selectedLanguage = document.getElementById('selectedLanguage');

    if (!languageButton || !languageOptions) {
        console.error('Botão de idioma não encontrado!');
        return;
    }

    // Alternar visibilidade do menu de idiomas
    languageButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Impede que o clique feche imediatamente
        languageOptions.classList.toggle('hidden');
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', function (event) {
        if (!languageButton.contains(event.target) && !languageOptions.contains(event.target)) {
            languageOptions.classList.add('hidden');
        }
    });

    // Troca de idioma e salva no localStorage
    languageButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const selectedLang = button.dataset.lang;
            selectedLanguage.textContent = selectedLang.toUpperCase();
            document.documentElement.lang = selectedLang;
            localStorage.setItem('selectedLanguage', selectedLang);
            languageOptions.classList.add('hidden'); // Fecha o menu após a escolha

            // ⚠️ Se for "PT", restauramos os textos originais
            if (selectedLang === 'pt') {
                restoreOriginalText();
            } else {
                await translatePage(selectedLang);
            }
        });
    });

    // Define o idioma salvo ao carregar e traduz a página
    const savedLang = localStorage.getItem('selectedLanguage') || 'pt';
    selectedLanguage.textContent = savedLang.toUpperCase();
    document.documentElement.lang = savedLang;
    if (savedLang !== 'pt') {
        translatePage(savedLang);
    }
}

// ⚠️ Função para traduzir a página usando a API MyMemory
async function translatePage(targetLang) {
    const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';
    const elementsToTranslate = document.querySelectorAll('[data-translate]');

    for (let element of elementsToTranslate) {
        const originalText = element.dataset.originalText || element.innerText;
        element.dataset.originalText = originalText; // Salva o texto original

        try {
            const response = await fetch(`${TRANSLATION_API_URL}?q=${encodeURIComponent(originalText)}&langpair=pt|${targetLang}&de=diogobittenc@gmail.com`);
            const data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                element.innerText = data.responseData.translatedText;
            }
        } catch (error) {
            console.error('Erro ao traduzir:', error);
        }
    }
}

// ⚠️ Função para restaurar os textos originais
function restoreOriginalText() {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        if (element.dataset.originalText) {
            element.innerText = element.dataset.originalText; // Restaura o original
        }
    });
}

// ⚠️ Ajustar o botão de idioma ao minimizar a sidebar
function adjustLanguageButton() {
    const sidebar = document.getElementById('sidebar');
    const languageText = document.querySelectorAll('.language-text');

    if (sidebar.classList.contains('sidebar-minimized')) {
        languageText.forEach(text => text.classList.add('hidden'));
    } else {
        languageText.forEach(text => text.classList.remove('hidden'));
    }
}



    // Seleciona elementos do chatbot
    const chatbotButton = document.getElementById("chatbotButton");
    const chatWindow = document.getElementById("chatWindow");
    const closeChat = document.getElementById("closeChat");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendButton = document.getElementById("sendButton");

    // 🔥 Exibir mensagem no chat com ajuste automático do tamanho do balão
    const displayMessage = (message, isUser = false) => {
        // Cria um contêiner para alinhar as mensagens corretamente
        const messageWrapper = document.createElement("div");
        messageWrapper.className = `flex w-full ${isUser ? "justify-end" : "justify-start"}`;

        // Cria a mensagem dentro do balão
        const messageDiv = document.createElement("div");
        messageDiv.className = `max-w-[95%] min-w-[10%] break-words p-3 rounded-lg text-sm ${
            isUser ? "bg-blue-600 text-white self-end text-right" : "bg-gray-600 text-white self-start text-left"
        }`;

        // Adiciona suporte para links clicáveis no formato Markdown
        const formattedMessage = message.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
            `<a href="$2" target="_blank" class="text-blue-400 font-bold underline">$1</a>`
        );

        // 🔥 Adiciona suporte para links clicáveis na resposta do chatbot
        messageDiv.innerHTML = message.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-WHITE underline text-bold">$1</a>'
        );


        messageDiv.innerHTML = formattedMessage;

        // Adiciona a mensagem dentro do contêiner
        messageWrapper.appendChild(messageDiv);
        chatMessages.appendChild(messageWrapper);
        
        // Rola automaticamente para a última mensagem
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Permitir envio ao pressionar Enter
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { // Impede que Shift+Enter adicione nova linha
            e.preventDefault(); // Evita que o input expanda ao enviar
            sendButton.click();
            chatInput.value = ""; // Limpa o campo de entrada
            chatInput.style.height = "40px"; // Reseta a altura do input
        }
    });

    // Ajusta dinamicamente a altura do input
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "40px"; // Define uma altura mínima
        chatInput.style.height = `${Math.min(chatInput.scrollHeight, 150)}px`; // Expande dinamicamente até 150px
    });

    // Adiciona um balão de "Digitando..."
    const showTypingIndicator = () => {
        const typingDiv = document.createElement("div");
        typingDiv.id = "typingIndicator";
        typingDiv.className = "text-sm p-2 rounded-lg mb-2 bg-gray-600 text-white self-start text-left";
        typingDiv.innerHTML = `<span class="typing-dots">Diobot está digitando <span>.</span><span>.</span><span>.</span></span>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Remove o balão de "Digitando..."
    const hideTypingIndicator = () => {
        const typingDiv = document.getElementById("typingIndicator");
        if (typingDiv) typingDiv.remove();
    };

    // Função para enviar mensagem ao servidor
    const sendMessageToServer = async (userMessage) => {
        try {
            showTypingIndicator(); // Exibe "Digitando..."

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            hideTypingIndicator(); // Remove "Digitando..."
            displayMessage(data.response, false);
        } catch (error) {
            hideTypingIndicator(); // Remove "Digitando..." em caso de erro
            console.error("Erro ao enviar mensagem para o servidor:", error);
            displayMessage("😔 Erro ao se conectar ao chatbot.", false);
        }
    };

    // Evento de envio de mensagem ao clicar no botão
    sendButton.addEventListener("click", () => {
        const userInput = chatInput.value.trim();
        if (userInput) {
            displayMessage(userInput, true);
            sendMessageToServer(userInput);
            chatInput.value = "";
        }
    });

    // Permitir envio ao pressionar Enter
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });

    // Evento ao abrir o chatbot
    chatbotButton.addEventListener("click", () => {
        chatWindow.classList.toggle("hidden");
        if (!chatWindow.classList.contains("hidden")) {
            chatMessages.innerHTML = "";
    
            // Exibir a primeira mensagem imediatamente
            setTimeout(() => {
            displayMessage("👋 Olá! Eu sou o Diobot.😊 Com poderes cósmicos e fenomenais!🎇🌌 mas dentro de um chatzin🤏🪔", false);
            }, 500); // 1000 ms = 1 segundo    

            // Exibir a segunda mensagem após 1 segundo
            setTimeout(() => {
                displayMessage("Pergunte sobre seus projetos, habilidades, experiências profissionais ou até mesmo peça o currículo", false);
            }, 1500); // 1000 ms = 1 segundo
        }
    });

    // Evento para fechar o chat
    closeChat.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
    });


    // Tooltip inicial
    setTimeout(() => {
        const chatTooltip = document.getElementById("chatTooltip");
        chatTooltip.classList.remove("hidden");
        setTimeout(() => {
            chatTooltip.classList.add("hidden"); // Esconde o balãozinho após 7 segundos
        }, 7000);
    }, 3000);



     // Configurar a API de clima
     function fetchWeather() {
        const city = 'Rio de Janeiro';
        const API_URL = `/api/weather?city=${encodeURIComponent(city)}`;
      
        fetch(API_URL)
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
 