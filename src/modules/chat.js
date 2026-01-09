import { parse } from 'marked';
import DOMPurify from 'dompurify';
import { translations } from './translations.js';

// Apufunktio kielen hakemiseen
const getLang = () => localStorage.getItem('language') || 'fi';

// UI-tekstit viestien lähettäjille
const uiLabels = {
    fi: { you: 'Sinä', bot: 'Avustaja' },
    en: { you: 'You', bot: 'Assistant' }
};

export function initChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatForm || !chatInput || !chatMessages) return;

    // --- KUUNTELIJA KIELEN VAIHDOLLE ---
    window.addEventListener('language-change', (e) => {
        const newLang = e.detail;
        updateChatUI(newLang, chatMessages);
    });

    // Tervetuloviesti (lisätään vain jos chat on tyhjä)
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            const lang = getLang();
            const welcomeText = translations[lang].chat.welcome_message;
            // 'welcome' -tyyppi auttaa tunnistamaan viestin myöhemmin päivitystä varten
            addMessage(chatMessages, welcomeText, 'bot', 'welcome');
        }, 800);
    }

    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        this.style.overflowY = (this.scrollHeight > 150) ? "auto" : "hidden";
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
            e.preventDefault();
            if (chatInput.value.trim()) chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Ehdotusnapit (Suggestion Chips)
    document.querySelectorAll('.suggestion-chip').forEach((chip, index) => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = getLang();
            // Haetaan kysymys käännöksistä indeksin perusteella
            const suggKey = `sugg_${index + 1}`;
            const questionText = translations[lang].chat[suggKey] || chip.innerText;

            chatInput.value = questionText;
            chatInput.dispatchEvent(new Event('input'));
            setTimeout(() => chatForm.dispatchEvent(new Event('submit')), 100);
        });
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        chatInput.disabled = true;
        addMessage(chatMessages, message, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';

        const typingIndicator = addTypingIndicator(chatMessages);

        try {
            const response = await sendMessageToAPI(message);
            typingIndicator.remove();
            addMessage(chatMessages, response, 'bot');
        } catch (error) {
            typingIndicator.remove();
            const lang = getLang();
            addMessage(chatMessages, translations[lang].chat.error_message, 'bot');
        } finally {
            chatInput.disabled = false;
            if (window.innerWidth >= 768) chatInput.focus();
        }
    });
}

// Funktio, joka päivittää olemassa olevat viestit (lähettäjän nimen & tervetuloviestin)
function updateChatUI(lang, container) {
    // 1. Päivitä "Sinä" / "Avustaja" tekstit
    container.querySelectorAll('.sender-label').forEach(label => {
        const type = label.getAttribute('data-type'); // 'you' tai 'bot'
        if (uiLabels[lang] && uiLabels[lang][type]) {
            label.textContent = uiLabels[lang][type];
        }
    });

    // 2. Päivitä tervetuloviestin sisältö
    const welcomeMsg = container.querySelector('[data-msg-type="welcome"]');
    if (welcomeMsg) {
        const rawHtml = parse(translations[lang].chat.welcome_message);
        // Korjattu muuttujan nimi ja välilyönti alla:
        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
        welcomeMsg.innerHTML = cleanHtml;
    }
}

function addMessage(container, text, sender, msgType = null) {
    const lang = getLang();
    const div = document.createElement('div');
    div.classList.add('flex', 'mb-6', 'animate-fade-in');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add(sender === 'user' ? 'max-w-[95%]' : 'max-w-[95%]', 'md:max-w-[85%]');

    if (sender === 'user') {
        div.classList.add('justify-end');
        contentWrapper.classList.add('ml-auto');

        const messageBox = document.createElement('div');
        messageBox.classList.add('user-message', 'p-3', 'text-sm');
        messageBox.textContent = text;

        const senderLabel = document.createElement('div');
        senderLabel.className = 'sender-label text-right mt-1 text-[10px] text-brown-light uppercase tracking-wider font-semibold';
        // Tunnisteet päivitystä varten
        senderLabel.setAttribute('data-type', 'you'); 
        senderLabel.textContent = uiLabels[lang].you;

        contentWrapper.appendChild(messageBox);
        contentWrapper.appendChild(senderLabel);
    } else {
        div.classList.add('justify-start');
        
        const flexContainer = document.createElement('div');
        flexContainer.className = 'flex items-start gap-3';

        const avatar = document.createElement('div');
        avatar.className = 'w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-light flex-shrink-0 flex items-center justify-center text-sm shadow-lg border border-gold/30';
        avatar.textContent = '👨🏻‍💻';

        const messageCol = document.createElement('div');
        const messageBox = document.createElement('div');
        messageBox.className = 'bot-message p-3 text-sm overflow-hidden';
        
        // Jos tämä on tervetuloviesti, merkitään se attribuutilla päivitystä varten
        if (msgType === 'welcome') {
            messageBox.setAttribute('data-msg-type', 'welcome');
        }

        const rawHtml = parse(text);
        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
        messageBox.innerHTML = cleanHtml;

        const senderLabel = document.createElement('div');
        senderLabel.className = 'sender-label mt-1 text-[10px] text-brown-light uppercase tracking-wider font-semibold ml-1';
        // Tunnisteet päivitystä varten
        senderLabel.setAttribute('data-type', 'bot');
        senderLabel.textContent = uiLabels[lang].bot;

        messageCol.appendChild(messageBox);
        messageCol.appendChild(senderLabel);

        flexContainer.appendChild(avatar);
        flexContainer.appendChild(messageCol);
        contentWrapper.appendChild(flexContainer);
    }

    div.appendChild(contentWrapper);
    container.appendChild(div);
    scrollToBottom(container, div);
}

function addTypingIndicator(container) {
    const div = document.createElement('div');
    div.classList.add('flex', 'justify-start', 'mb-6');
    div.innerHTML = `
        <div class="flex items-start gap-3">
             <div class="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm opacity-50">👨🏻‍💻</div>
            <div class="bot-message p-4 flex items-center h-10">
                <div class="typing-indicator flex gap-1">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
            </div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
}

function scrollToBottom(container, element) {
    if (!element) {
        container.scrollTop = container.scrollHeight;
        return;
    }
    requestAnimationFrame(() => {
         const targetPos = element.offsetTop - 20;
         container.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
}

async function sendMessageToAPI(message) {
    const lang = getLang();
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = 'user_' + Date.now();
        localStorage.setItem('chat_session_id', sessionId);
    }
    const threadId = localStorage.getItem('openai_thread_id');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        
        const res = await fetch(`${apiBaseUrl}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, user_id: sessionId, thread_id: threadId }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(res.status);
        
        const data = await res.json();
        if (data.thread_id) localStorage.setItem('openai_thread_id', data.thread_id);
        
        // Huom: API:n vastaus on sillä kielellä millä API vastaa. 
        // Virhetilanteessa käytetään käännettyä virheviestiä.
        return data.answer || translations[lang].chat.error_message;
    } catch (e) {
        return translations[lang].chat.error_message;
    }
}