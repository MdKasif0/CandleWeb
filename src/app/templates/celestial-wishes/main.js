
// --- Global State ---
let currentQuote = 0;
let quotes = [];
let wishData = {};

// --- Data Loading ---
function loadWishData() {
    const params = new URLSearchParams(window.location.search);
    const wishId = params.get('id');

    if (wishId) {
        // --- Production Mode: Load from localStorage ---
        try {
            const wishList = JSON.parse(localStorage.getItem('userWishes') || '[]');
            const mainData = wishList.find(w => w.id === wishId);

            if (!mainData) {
                console.error("Wish data not found in localStorage.");
                // Provide fallback data to prevent crash
                wishData = getPreviewData(params);
            } else {
                wishData = mainData;
            }
        } catch (error) {
            console.error("Failed to load or parse wish data from localStorage", error);
            wishData = getPreviewData(params); // Fallback
        }
    } else {
        // --- Preview Mode: Load from URL parameters ---
        wishData = getPreviewData(params);
    }
}

function getPreviewData(params) {
    const beautifulMemoriesParam = params.get('beautifulMemories');
    const friendsMessagesParam = params.get('friendsMessages');

    let beautifulMemories = [];
    try {
        if (beautifulMemoriesParam) {
            beautifulMemories = JSON.parse(decodeURIComponent(beautifulMemoriesParam));
        }
    } catch(e) { console.error("Could not parse beautifulMemories", e); }

    let friendsMessages = [];
     try {
        if (friendsMessagesParam) {
            friendsMessages = JSON.parse(decodeURIComponent(friendsMessagesParam));
        }
    } catch(e) { console.error("Could not parse friendsMessages", e); }


    return {
        toName: params.get('toName') || 'Someone',
        fromName: params.get('fromName') || 'A Friend',
        message: params.get('message') || 'Wishing you a day filled with happiness and a year filled with joy. Happy birthday!',
        closingMessages: params.get('closingMessages') || "Wishing you all the best!\nMay all your dreams come true!\nCheers to you!",
        secretMessage: params.get('secretMessage') || "Here's to another amazing year! 🤫",
        profilePhoto: params.get('profilePhoto') || '',
        beautifulMemories: beautifulMemories,
        specialGiftMessage: params.get('specialGiftMessage') || 'May every moment of your special day be filled with the same joy and happiness you bring to others!',
        friendsMessages: friendsMessages,
        saveKeepsakeMessage: params.get('saveKeepsakeMessage') || 'Save this memory forever.',
        endMessage: params.get('endMessage') || 'The End',
    };
}


// --- Content Population ---
function populateContent() {
    const {
        toName = 'Sarah',
        fromName = 'A Friend',
        message = "Happy Birthday! Wishing you a day filled with joy.",
        closingMessages = "All the best!\nCheers!",
        secretMessage = "",
        profilePhoto = "",
        beautifulMemories = [],
        specialGiftMessage = "May your day be filled with joy!",
        friendsMessages = [],
        saveKeepsakeMessage = "Save Keepsake",
        endMessage = "The End"
    } = wishData;

    // SEO & Social Sharing
    updateSEOTags(toName, fromName);

    // Hero
    const heroTitleEl = document.getElementById('heroTitle');
    if (heroTitleEl) {
        heroTitleEl.textContent = `Happy Birthday ${toName}!`;
    }
    const profilePhotoEl = document.getElementById('profilePhoto');
    if (profilePhoto && profilePhotoEl) {
        profilePhotoEl.style.backgroundImage = `url(${profilePhoto})`;
        profilePhotoEl.style.backgroundSize = 'cover';
        profilePhotoEl.style.backgroundPosition = 'center';
    }

    // Main Message
    const typedElement = document.getElementById('typedMessage');
    const cursor = document.getElementById('cursor');
    if (typedElement && cursor) {
        typedElement.innerHTML = ''; // Clear existing
        typedElement.appendChild(cursor);
        startTypingAnimation(message, typedElement, cursor);
    }


    // Beautiful Memories
    const galleryContainer = document.getElementById('galleryContainer');
    const gallerySection = document.getElementById('gallerySection');
    if (gallerySection) {
        if (beautifulMemories && beautifulMemories.length > 0 && galleryContainer) {
            galleryContainer.innerHTML = ''; // Clear placeholder
            beautifulMemories.forEach(memory => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                const img = document.createElement('img');
                img.src = memory.src; // Expects an array of objects with a 'src' property
                img.alt = 'Beautiful Memory';
                item.appendChild(img);
                galleryContainer.appendChild(item);
            });
            gallerySection.style.display = 'block';
        } else {
            gallerySection.style.display = 'none'; // Hide section if no memories
        }
    }


    // Birthday Wishes (Quotes)
    const quotesContainer = document.getElementById('quotesContainer');
    const quotesSection = document.getElementById('quotes');
    quotes = (closingMessages || "").split('\n').filter(q => q.trim() !== '');
    if (quotesSection) {
        if (quotes.length > 0 && quotesContainer) {
            quotesContainer.innerHTML = '';
            quotes.forEach((q, index) => {
                const quoteEl = document.createElement('div');
                quoteEl.className = `quote ${index === 0 ? 'active' : ''}`;
                quoteEl.textContent = `"${q}" ✨`;
                quotesContainer.appendChild(quoteEl);
            });
            startQuoteRotation();
            quotesSection.style.display = 'block';
        } else {
            quotesSection.style.display = 'none';
        }
    }
    
    // Special Gift
    const specialGiftMessageEl = document.getElementById('specialGiftMessage');
    const giftSection = document.getElementById('gift');
    if (specialGiftMessage && specialGiftMessageEl && giftSection) {
        specialGiftMessageEl.textContent = specialGiftMessage;
        giftSection.style.display = 'block';
    } else if (giftSection) {
        giftSection.style.display = 'none';
    }

    // Friends Messages
    const friendsGrid = document.getElementById('friendsGrid');
    const friendsSection = document.getElementById('friendsSection');
    if (friendsSection) {
        if (friendsMessages && friendsMessages.length > 0 && friendsGrid) {
            friendsGrid.innerHTML = ''; // Clear placeholder
            friendsMessages.forEach(friend => {
                const card = document.createElement('div');
                card.className = 'friend-card';
                const nameEl = document.createElement('div');
                nameEl.className = 'friend-name';
                nameEl.textContent = friend.name;
                const msgEl = document.createElement('div');
                msgEl.className = 'friend-message';
                msgEl.textContent = `"${friend.message}"`;
                card.appendChild(nameEl);
                card.appendChild(msgEl);
                friendsGrid.appendChild(card);
            });
            friendsSection.style.display = 'block';
        } else {
            friendsSection.style.display = 'none'; // Hide section if no friends
        }
    }


    // Closing & Secret Message
    const closingTitleEl = document.getElementById('closingTitle');
    if (closingTitleEl) {
        closingTitleEl.textContent = `${endMessage}!`;
    }
    const closingMessageEl = document.getElementById('closingMessage');
    if (closingMessageEl) {
        closingMessageEl.textContent = `A special wish from ${fromName} 💖`;
    }
    const secretMessageContainer = document.getElementById('secretMessageContainer');
    const secretMessageText = document.getElementById('secretMessageText');
    if (secretMessageContainer && secretMessageText) {
        if (secretMessage) {
            secretMessageText.textContent = secretMessage;
            secretMessageContainer.style.display = 'block';
        } else {
            secretMessageContainer.style.display = 'none';
        }
    }

    // Keepsake Button
    const downloadBtnEl = document.getElementById('downloadBtn');
    if (downloadBtnEl && saveKeepsakeMessage) {
        downloadBtnEl.textContent = `💾 ${saveKeepsakeMessage}`;
    }
}

function updateSEOTags(toName, fromName) {
    const pageTitle = `A Celestial Wish for ${toName}!`;
    const pageDescription = `A special birthday message for ${toName} from ${fromName}. Create your own at CandleWeb!`;
    const pageUrl = window.location.href;

    document.title = pageTitle;
    const metas = [
        { selector: 'meta[property="og:title"]', content: pageTitle },
        { selector: 'meta[property="og:description"]', content: pageDescription },
        { selector: 'meta[property="og:url"]', content: pageUrl },
        { selector: 'meta[property="og:image:alt"]', content: `A birthday wish for ${toName}` },
        { selector: 'meta[name="twitter:title"]', content: pageTitle },
        { selector: 'meta[name="twitter:description"]', content: pageDescription },
        { selector: 'meta[name="twitter:url"]', content: pageUrl },
        { selector: 'meta[name="twitter:image:alt"]', content: `A birthday wish for ${toName}` },
    ];
    metas.forEach(meta => {
        const el = document.querySelector(meta.selector);
        if (el) el.setAttribute('content', meta.content);
    });
}

// --- Animations and Interactions ---
document.addEventListener('DOMContentLoaded', function() {
    loadWishData();
    populateContent();

    createFloatingElements();
    initConfetti();
    setupOpeningAnimation();
    setupEventListeners();
    setupIntersectionObserver();
});

function setupOpeningAnimation() {
    const giftContainer = document.getElementById('giftContainer');
    if (giftContainer) {
        giftContainer.addEventListener('click', openGift, { once: true });
    }
}

function openGift() {
    const giftContainer = document.getElementById('giftContainer');
    const cakeContainer = document.getElementById('cakeContainer');
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');

    if (giftContainer) giftContainer.classList.add('opening');
    triggerConfetti();

    setTimeout(() => {
        if (cakeContainer) cakeContainer.classList.add('reveal');
    }, 600);

    setTimeout(() => {
        if (loader) loader.style.opacity = '0';
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
            if (mainContent) mainContent.classList.add('visible');
            const typedElement = document.getElementById('typedMessage');
            const cursor = document.getElementById('cursor');
            if (typedElement && cursor) {
               startTypingAnimation(wishData.message, typedElement, cursor);
            }
        }, 1500); 
    }, 3000); 
}

function startTypingAnimation(text, element, cursor) {
    if (!text || !element || !cursor) return;
    let index = 0;
    function typeCharacter() {
        if (index < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(index)), cursor);
            index++;
            setTimeout(typeCharacter, 50);
        } else {
            cursor.style.display = 'none';
        }
    }
    setTimeout(typeCharacter, 1000);
}

function startQuoteRotation() {
    const quoteElements = document.querySelectorAll('#quotesContainer .quote');
    if(quoteElements.length === 0) return;
    setInterval(() => {
        if (quoteElements[currentQuote]) {
            quoteElements[currentQuote].classList.remove('active');
        }
        currentQuote = (currentQuote + 1) % quoteElements.length;
        if (quoteElements[currentQuote]) {
            quoteElements[currentQuote].classList.add('active');
        }
    }, 4000);
}

function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    if (!container) return;
    const balloons = ['🎈', '🎂', '🎁', '🌟', '✨', '🎉', '💝', '🎊'];
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = balloons[Math.floor(Math.random() * balloons.length)];
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.top = Math.random() * 100 + '%';
        balloon.style.animationDelay = Math.random() * 6 + 's';
        balloon.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(balloon);
    }
}

function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const confettiCount = 150;
    const particles = [];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7D060', '#F3BCC8'];
    for (let i = 0; i < confettiCount; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: Math.random() * 2 * Math.PI,
            speed: Math.random() * 5 + 2,
            friction: 0.97,
            decay: Math.random() * 0.02 + 0.01,
            alpha: 1
        });
    }

    function animateConfetti() {
        if (particles.length === 0) return;
        requestAnimationFrame(animateConfetti);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            if (p.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                p.speed *= p.friction;
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed + 1; // gravity
                p.alpha -= p.decay;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.closePath();
            }
        });
    }
    animateConfetti();
}

function setupEventListeners() {
    const giftCard = document.getElementById('giftCard');
    if (giftCard) {
        giftCard.addEventListener('click', function() {
            this.classList.toggle('flipped');
            triggerConfetti();
        });
    }
    
    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => location.reload());
    }
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const { toName = 'Friend', saveKeepsakeMessage = 'A special memory' } = wishData;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 600;
            const gradient = ctx.createLinearGradient(0, 0, 800, 600);
            gradient.addColorStop(0, '#FFF8DC');
            gradient.addColorStop(0.5, '#FFE4E6');
            gradient.addColorStop(1, '#E6E6FA');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 48px Dancing Script, cursive';
            ctx.textAlign = 'center';
            ctx.fillText(`Happy Birthday, ${toName}!`, 400, 200);
            ctx.fillStyle = '#666';
            ctx.font = '24px Poppins, sans-serif';
            ctx.fillText(saveKeepsakeMessage, 400, 300);
            ctx.fillText('on your special day!', 400, 340);
            const link = document.createElement('a');
            link.download = `birthday-keepsake-for-${toName.replace(/ /g, '_')}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
        if(section) observer.observe(section);
    });
}

document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.95) { // Throttle sparkle creation
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-trail';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
});

// Add keyframe for mousemove sparkle if not present in a separate style tag
if (!document.getElementById('sparkle-keyframes')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'sparkle-keyframes';
    styleEl.innerHTML = `
        .sparkle-trail {
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            width: 6px;
            height: 6px;
            background: var(--gold);
            border-radius: 50%;
            animation: sparkleFloat 2s ease-in-out forwards;
        }

        @keyframes sparkleFloat {
            0% { transform: translateY(0) scale(0); opacity: 0; }
            50% { transform: translateY(-30px) scale(1); opacity: 1; }
            100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(styleEl);
}
