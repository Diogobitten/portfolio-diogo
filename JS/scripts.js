document.addEventListener('DOMContentLoaded', function () {
    // Carregar o conteúdo do sidebar.html no div do sidebarContainer e Tradutor
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

           // Chatbot
           const chatbotButton = document.getElementById('chatbotButton');
           const chatWindow = document.getElementById('chatWindow');
           const closeChat = document.getElementById('closeChat');
           const chatMessages = document.getElementById('chatMessages');
           const chatInput = document.getElementById('chatInput');
           const sendButton = document.getElementById('sendButton');
       
           // Respostas do Chatbot
           const faqAnswers = {
               formação: `
                   Sou estudante de <strong>Análise e Desenvolvimento de Sistemas</strong> na FIAP, com conclusão prevista para <strong>2025</strong>. 
                   Também sou graduado em <strong>Publicidade e Propaganda</strong> pelo IBMR.
               `,
               habilidades: `
                   Minhas principais habilidades incluem:
                   <ul class="list-disc pl-5 space-y-2">
                       <li><strong>Front-end:</strong> HTML, CSS, JavaScript, React, Bootstrap, Tailwind e GSAP.</li>
                       <li><strong>Back-end:</strong> Python, Java, Banco de Dados Oracle.</li>
                       <li><strong>Outros:</strong> AWS, UX/UI Design, conhecimentos avançados em Design Gráfico.</li>
                   </ul>
               `,
               projetos: `
                   Já desenvolvi projetos como:
                   <ul class="list-disc pl-5 space-y-2">
                       <li><strong>Fintech:</strong> Aplicação web focada em gerenciamento financeiro pessoal.</li>
                       <li><strong>iFood Challenger:</strong> Sistema para alocação de recursos para parceiros do iFood.</li>
                       <li><strong>SmartCondo:</strong> Projeto focado em sustentabilidade e eficiência energética.</li>
                   </ul>
               `,
               experiências: `
                   Trabalhei como <strong>Diretor de Arte</strong> na Beonne, na Flórida, onde desenvolvi:
                   <ul class="list-disc pl-5 space-y-2">
                       <li>Layouts e soluções para e-commerce.</li>
                       <li>Conteúdo visual para marcas no Amazon Seller Central.</li>
                   </ul>
               `,
               contato: `
                   Você pode entrar em contato comigo pelos seguintes meios:
                   <ul class="list-disc pl-5 space-y-2">
                       <li><strong>Email:</strong> diogobittenc@gmail.com</li>
                       <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/diogo-bittencourt-de-oliveira/" target="_blank">Clique Aqui</a></li>
                       <li><strong>GitHub:</strong> <a href="https://github.com/Diogobitten" target="_blank">Clique Aqui</a></li>
                   </ul>
               `,
               contratar: `
                   <strong>Por que me contratar?</strong><br>
                   Combinando criatividade, habilidades técnicas sólidas e uma paixão por soluções inovadoras, 
                   sou o candidato ideal para qualquer equipe que busque excelência. Eu trago visão estratégica, 
                   execução técnica e um compromisso inabalável com resultados.
               `,
               oi: `
                   Oi! Que bom te ver por aqui. 😊<br>
                   O que você gostaria de saber sobre o Diogo? Posso te falar sobre formação, habilidades, projetos ou algo mais!
               `,
               olá: `
                   Olá! Que bom te ver por aqui. 😊<br>
                   O que você gostaria de saber sobre o Diogo? Posso te falar sobre formação, habilidades, projetos ou algo mais!
               `,
               ola: `
                   Olá! Que bom te ver por aqui. 😊<br>
                   O que você gostaria de saber sobre o Diogo? Posso te falar sobre formação, habilidades, projetos ou algo mais!
               `,
               tchau: `
                   Espero ter ajudado! 🚀<br>
                   Foi ótimo falar com você. Até a próxima e lembre-se: o Diogo pode ser um grande trunfo para sua equipe! 😄
               `,
               obrigado: `
                   De nada! 😄<br>
                   Se precisar de mais alguma coisa, é só chamar. Sempre um prazer ajudar!
               `,
               obrigada: `
                   De nada! 😄<br>
                   Se precisar de mais alguma coisa, é só chamar. Sempre um prazer ajudar!
               `,
               valeu: `
                   TMJ 😄<br>
                   Se precisar de mais alguma coisa, é só chamar. Sempre um prazer ajudar!
               `,
               vlw: `
                   TMJ 😄<br>
                   Se precisar de mais alguma coisa, é só chamar. Sempre um prazer ajudar!
               `,
               'sobre o diogo': `
               <strong>Quem é o Diogo?</strong><br>
               Diogo é um profissional apaixonado por tecnologia e design. Com um pé na publicidade e o outro no desenvolvimento de sistemas, ele traz uma combinação única de habilidades criativas e técnicas. 
               É graduado em <strong>Publicidade e Propaganda</strong> pelo IBMR e está cursando <strong>Análise e Desenvolvimento de Sistemas</strong> na FIAP. 💻✨<br>
               Diogo já desenvolveu projetos inovadores como o <strong>SmartCondo</strong>, focado em sustentabilidade, e o <strong>Fintech</strong>, uma solução para gerenciamento financeiro pessoal.<br>
               Ele adora desafios, é especialista em UX/UI, front-end e back-end, e está sempre pronto para entregar resultados impressionantes! 🚀<br>
               Quer um trunfo para sua equipe? O Diogo é sua melhor escolha! 😄
               `,
               currículo: `
               <strong>Baixe meu currículo com um clique! 🚀</strong><br>
               <a href="./docs/cv_diogo_bittencourt_dev_brasil.pdf" target="_blank" class="text-white underline">Clique aqui para baixar meu currículo</a>
               `,
               curriculo: `
               <strong>Baixe meu currículo com um clique! 🚀</strong><br>
               <a href="./docs/cv_diogo_bittencourt_dev_brasil.pdf" target="_blank" class="text-white underline">Clique aqui para baixar meu currículo</a> 
               `
           };
       
           // Exibir mensagens no chat
           const displayMessage = (message, isUser = false) => {
               const messageDiv = document.createElement('div');
               messageDiv.className = `text-sm p-2 rounded-lg mb-2 ${
                   isUser ? 'bg-blue-600 text-white self-end text-right' : 'bg-gray-600 text-white self-start text-left'
               }`;
               messageDiv.innerHTML = message;
               chatMessages.appendChild(messageDiv);
               chatMessages.scrollTop = chatMessages.scrollHeight; // Mantém a rolagem no final
           };
       
           // Processar entrada do usuário sem derivados para "Oi", "Tchau" e "Obrigado"
           const processInput = (input) => {
               const lowerCaseInput = input.toLowerCase().trim();
       
               // Respostas fixas apenas para "oi", "olá", "tchau" e "obrigado"
               if (faqAnswers[lowerCaseInput]) {
                   displayMessage(faqAnswers[lowerCaseInput]);
               } else {
                   const keywords = Object.keys(faqAnswers).filter(
                       (keyword) => !["oi", "olá", "tchau", "obrigado"].includes(keyword)
                   );
       
                   // Verifica se alguma palavra-chave regular foi encontrada
                   const matchedKeywords = keywords.filter((keyword) =>
                       lowerCaseInput.includes(keyword)
                   );
       
                   if (matchedKeywords.length > 0) {
                       matchedKeywords.forEach((keyword) => {
                           displayMessage(faqAnswers[keyword]);
                       });
                   } else {
                       displayMessage(
                           'Desculpe, estou limitado apenas para falar sobre os projetos e do Diogo. Tente usar palavras como "formação", "habilidades", "projetos", "experiências", "contato".'
                       );
                   }
               }
           };
       
           // Exibir perguntas iniciais
           const displayInitialQuestions = () => {
               displayMessage('Veja os motivos para ter o Diogo no seu time.');
       
               const initialQuestions = ['Qual é a sua formação?', 'Quais são suas habilidades?', 'Quais projetos você já desenvolveu?'];
               initialQuestions.forEach((question) => {
                   const questionButton = document.createElement('button');
                   questionButton.className = 'faq-button border-2 rounded-lg mb-2 px-4 py-2 hover:bg-blue-700';
                   questionButton.textContent = question;
                   questionButton.addEventListener('click', () => {
                       displayMessage(question, true); // Exibe a pergunta no chat como mensagem do usuário
                       processInput(question); // Processa a pergunta clicada
                   });
                   chatMessages.appendChild(questionButton);
               });
       
               // Mensagem para entrada personalizada
               setTimeout(() => {
                   displayMessage('Olá! Posso te falar sobre minha formação, habilidades, projetos, experiências ou fornecer minhas informações de contato. Como posso ajudar?');
               }, 1000);
           };
       
           // Tooltip inicial
           setTimeout(() => {
               const chatTooltip = document.getElementById('chatTooltip');
               chatTooltip.classList.remove('hidden');
               setTimeout(() => {
                   chatTooltip.classList.add('hidden'); // Esconde o balãozinho após 7 segundos
               }, 7000);
           }, 3000);
       
           // Enviar mensagem ao clicar no botão
           sendButton.addEventListener('click', () => {
               const userInput = chatInput.value.trim();
               if (userInput) {
                   displayMessage(userInput, true); // Exibe a mensagem do usuário
                   processInput(userInput); // Processa a entrada do usuário
                   chatInput.value = ''; // Limpa o campo de entrada
               }
           });
       
           // Permitir envio ao pressionar Enter
           chatInput.addEventListener('keypress', (e) => {
               if (e.key === 'Enter') {
                   sendButton.click();
               }
           });
       
           // Abrir/fechar o chatbot
           chatbotButton.addEventListener('click', () => {
               chatWindow.classList.toggle('hidden');
               if (!chatWindow.classList.contains('hidden')) {
                   chatMessages.innerHTML = ''; // Limpa o chat ao abrir
                   displayInitialQuestions(); // Exibe as perguntas iniciais
               }
           });
       
           closeChat.addEventListener('click', () => {
               chatWindow.classList.add('hidden');
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
 