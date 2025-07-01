// Global variables
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote');

// --- Get data from URL ---
const params = new URLSearchParams(window.location.search);
const toName = params.get('toName') || 'Sarah';
const fromName = params.get('fromName') || 'A Friend';
const message = params.get('message') || "Dear wonderful person, on this special day, we celebrate not just another year of your life, but all the joy, kindness, and light you bring to the world. Your presence makes everything brighter, and today we honor the amazing person you are. May this birthday be the beginning of your most incredible year yet!";

// --- SEO & Social Sharing Updates ---
const pageTitle = `A Celestial Wish for ${toName}!`;
const pageDescription = `A special birthday message for ${toName} from ${fromName}. Create your own at CandleWeb!`;
const pageUrl = window.location.href;

document.title = pageTitle;
const ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) ogTitle.setAttribute('content', pageTitle);
const ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc) ogDesc.setAttribute('content', pageDescription);
const ogUrl = document.querySelector('meta[property="og:url"]');
if (ogUrl) ogUrl.setAttribute('content', pageUrl);
const ogAlt = document.querySelector('meta[property="og:image:alt"]');
if (ogAlt) ogAlt.setAttribute('content', `A birthday wish for ${toName}`);

const twitterTitle = document.querySelector('meta[property="twitter:title"]');
if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
const twitterDesc = document.querySelector('meta[property="twitter:description"]');
if (twitterDesc) twitterDesc.setAttribute('content', pageDescription);
const twitterUrl = document.querySelector('meta[property="twitter:url"]');
if (twitterUrl) twitterUrl.setAttribute('content', pageUrl);
const twitterAlt = document.querySelector('meta[property="twitter:image:alt"]');
if (twitterAlt) twitterAlt.setAttribute('content', `A birthday wish for ${toName}`);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Update dynamic content
    document.getElementById('heroTitle').textContent = `Happy Birthday ${toName}!`;
    const firstFriendName = document.querySelector('.friend-name');
    if(firstFriendName) firstFriendName.textContent = fromName;

    createFloatingElements();
    initConfetti();
    setupOpeningAnimation();
    setupEventListeners();
    setupIntersectionObserver();
});

// --- START: UPDATED OPENING SCRIPT ---
function setupOpeningAnimation() {
    const giftContainer = document.getElementById('giftContainer');
    giftContainer.addEventListener('click', openGift, { once: true });
}

function openGift() {
    const giftContainer = document.getElementById('giftContainer');
    const cakeContainer = document.getElementById('cakeContainer');
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');

    // 1. Add 'opening' class to start the lid and light burst animations
    giftContainer.classList.add('opening');
    
    // 2. Trigger a confetti burst
    triggerConfetti();

    // 3. After a delay, reveal the cake
    setTimeout(() => {
        cakeContainer.classList.add('reveal');
    }, 600);

    // 4. After the cake is revealed, start fading out the loader
    setTimeout(() => {
        loader.style.opacity = '0';
        
        // 5. When the fade-out is complete, hide loader and show main content
        setTimeout(() => {
            loader.classList.add('hidden');
            mainContent.classList.add('visible');
            startTypingAnimation();
            startQuoteRotation();
        }, 1500); // This matches the loader's transition duration
    }, 3000); // This delay allows time to enjoy the cake animation
}
// --- END: UPDATED OPENING SCRIPT ---

// Typing Animation
function startTypingAnimation() {
    const typedElement = document.getElementById('typedMessage');
    const cursor = document.getElementById('cursor');
    let index = 0;
    
    function typeCharacter() {
        if (index < message.length) {
            typedElement.insertBefore(document.createTextNode(message.charAt(index)), cursor);
            index++;
            setTimeout(typeCharacter, 50);
        } else {
            cursor.style.display = 'none';
        }
    }
    
    setTimeout(typeCharacter, 1000); // Shortened delay to start typing sooner
}

// Quote Rotation
function startQuoteRotation() {
    setInterval(() => {
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }, 4000);
}

// Floating Elements
function createFloatingElements() {
    const container = document.getElementById('floatingElements');
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

// Confetti System
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
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

// Event Listeners
function setupEventListeners() {
    // Gift card flip
    document.getElementById('giftCard').addEventListener('click', function() {
        this.classList.toggle('flipped');
        triggerConfetti();
    });
    
    // Replay button
    document.getElementById('replayBtn').addEventListener('click', function() {
        location.reload();
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Create a simple birthday card
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#FFF8DC');
        gradient.addColorStop(0.5, '#FFE4E6');
        gradient.addColorStop(1, '#E6E6FA');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 48px Dancing Script, cursive';
        ctx.textAlign = 'center';
        ctx.fillText('Happy Birthday!', 400, 200);
        
        ctx.fillStyle = '#666';
        ctx.font = '24px Poppins, sans-serif';
        ctx.fillText('Wishing you joy, love, and happiness', 400, 300);
        ctx.fillText('on your special day!', 400, 340);
        
        // Download the canvas as image
        const link = document.createElement('a');
        link.download = 'birthday-keepsake.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Add some interactive hover effects
document.addEventListener('mousemove', function(e) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.background = 'var(--gold)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.animation = 'sparkleFloat 2s ease-in-out forwards';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 2000);
});

// Add keyframe for mousemove sparkle if not present
// A check to see if the stylesheet and its rules are accessible
if (document.styleSheets.length > 0 && document.styleSheets[0].cssRules) {
    const styleSheet = document.styleSheets[0];
    const keyframes = `@keyframes sparkleFloat {
        0% { transform: translateY(0) scale(0); opacity: 0; }
        50% { transform: translateY(-30px) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0); opacity: 0; }
    }`;
    
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch(e) {
      console.warn("Could not insert sparkle keyframe, it might already exist.", e);
    }
}
