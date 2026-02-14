const levels = [
    {
        answer: "GORGEOUS",
        hint: "",
        interstitial: "That's you. Every single day.",
        photos: [
            "photos for puzzle1/Messenger_creation_0DEE10D3-7F84-40EB-B4FF-AB8C363F0B72.jpeg",
            "photos for puzzle1/Messenger_creation_4A631BB3-82EC-4296-A893-9782EEB46F5D.jpeg",
            "photos for puzzle1/Messenger_creation_676249DA-0E95-4FD1-A6B4-BD562954C0D5.jpeg",
            "photos for puzzle1/Messenger_creation_F42DE41F-A400-4929-A0D0-78E5AB26D5AF.jpeg"
        ]
    },
    {
        answer: "LONGTERM",
        hint: "Two words together: long _ _",
        interstitial: "It all started with us... and I'm in it for the long term.",
        photos: [
            "photos for puzzle2/IMG_20251121_203509_240.jpg",
            "photos for puzzle2/IMG_20251226_113214_564.jpg",
            "photos for puzzle2/images (10).png",
            "photos for puzzle2/stock-vector-colored-pencils-of-different-lengths-isolated-on-white-background-educational-card-blank-2267915113.jpg"
        ]
    },
    {
        answer: "VALENTINE",
        hint: "",
        interstitial: "", // No interstitial for level 3, goes straight to final
        photos: [
            "photos for puzzle3/image-20160511-18171-kulas4.jpg", // Willie?
            "photos for puzzle3/images (85).jpeg", // Pointing Hand
            "photos for puzzle3/images (83).jpeg", // Bee
            "photos for puzzle3/images (84).jpeg"  // Logo
        ]
    }
];

let currentLevelIndex = 0;
let currentGuess = [];
let shuffledLetters = [];
let audioPlaying = false;

// DOM Elements
const screens = {
    landing: document.getElementById('landing-page'),
    game: document.getElementById('game-page'),
    interstitial: document.getElementById('interstitial-page'),
    final: document.getElementById('final-page')
};

const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const restartBtn = document.getElementById('restart-btn');

// Init
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('continue-btn').addEventListener('click', nextLevel);
document.getElementById('check-btn').addEventListener('click', checkAnswer);
document.getElementById('shuffle-btn').addEventListener('click', shuffleCurrentLetters);
restartBtn.addEventListener('click', () => location.reload());

musicBtn.addEventListener('click', () => {
    if (audioPlaying) {
        audio.pause();
        musicBtn.textContent = "🔇 Music";
    } else {
        audio.play().catch(e => console.log("Audio play blocked", e));
        musicBtn.textContent = "🔊 Music";
    }
    audioPlaying = !audioPlaying;
});

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startGame() {
    audio.play().then(() => {
        audioPlaying = true;
        musicBtn.textContent = "🔊 Music";
    }).catch(() => {
        console.log("Audio autoplay blocked");
    });
    
    restartBtn.classList.remove('hidden');
    loadLevel(0);
    switchScreen('game');
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = levels[index];
    
    // Update Text
    document.getElementById('level-title').innerHTML = `Puzzle ${index + 1} of 3 <span class="heart-icon">💕</span>`;
    document.getElementById('level-hint').textContent = level.hint;

    // Load Photos
    const grid = document.getElementById('photos-grid');
    grid.innerHTML = level.photos.map(src => `<img src="${src}" alt="Puzzle Image">`).join('');

    // Prepare Slots
    const slotsContainer = document.getElementById('answer-slots');
    slotsContainer.innerHTML = '';
    currentGuess = new Array(level.answer.length).fill('');
    
    for (let i = 0; i < level.answer.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = i;
        slot.addEventListener('click', () => removeLetterFromSlot(i));
        slotsContainer.appendChild(slot);
    }

    // Prepare Letters (Answer + Randoms)
    generateLetters(level.answer);
}

function generateLetters(answer) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let pool = answer.split('');
    
    // Add 5 random letters
    for (let i = 0; i < 5; i++) {
        pool.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    
    shuffledLetters = pool.sort(() => Math.random() - 0.5);
    renderLetters();
}

function renderLetters() {
    const container = document.getElementById('letters-pool');
    container.innerHTML = '';
    
    shuffledLetters.forEach((char, idx) => {
        const btn = document.createElement('div');
        btn.className = 'letter-btn';
        btn.textContent = char;
        btn.dataset.char = char;
        btn.dataset.poolIndex = idx;
        
        // Check if this specific instance of letter is used
        if (isLetterUsed(idx)) {
            btn.classList.add('used');
        } else {
            btn.addEventListener('click', () => addLetterToSlot(char, idx));
        }
        
        container.appendChild(btn);
    });
}

// Track valid pool indices currently in the slots
let usedPoolIndices = []; 

function addLetterToSlot(char, poolIndex) {
    const firstEmptyIndex = currentGuess.indexOf('');
    if (firstEmptyIndex === -1) return; // Full

    currentGuess[firstEmptyIndex] = { char, poolIndex };
    updateSlots();
    renderLetters();
}

function removeLetterFromSlot(slotIndex) {
    if (!currentGuess[slotIndex]) return;
    
    currentGuess[slotIndex] = '';
    updateSlots();
    renderLetters();
}

function isLetterUsed(poolIndex) {
    return currentGuess.some(item => item && item.poolIndex === poolIndex);
}

function updateSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, i) => {
        slot.textContent = currentGuess[i] ? currentGuess[i].char : '';
    });
}

function shuffleCurrentLetters() {
    // Only shuffle if no letters are placed (simplification for UX)
    // Or just re-randomize the pool array but keep tracking indices? 
    // Easier: Reset the level
    // But let's verify if user wants to just shuffle the visual order.
    // For simplicity, we restart the level's letters
    
    // Resetting guess
    currentGuess = new Array(levels[currentLevelIndex].answer.length).fill('');
    updateSlots();
    
    // Reshuffle
    shuffledLetters.sort(() => Math.random() - 0.5);
    renderLetters();
}

function checkAnswer() {
    const guessString = currentGuess.map(item => item ? item.char : '').join('');
    const correct = levels[currentLevelIndex].answer;
    
    if (guessString === correct) {
        // Success
        if (levels[currentLevelIndex].interstitial) {
            document.getElementById('interstitial-text').textContent = levels[currentLevelIndex].interstitial;
            switchScreen('interstitial');
        } else {
            // No interstitial -> Final
             // If this was the last level
            if (currentLevelIndex === levels.length - 1) {
                switchScreen('final');
            } else {
                // Next level directly? (Logic fallback)
                nextLevel(); 
            }
        }
    } else {
        // Shake animation
        const slots = document.getElementById('answer-slots');
        slots.classList.add('shake');
        setTimeout(() => slots.classList.remove('shake'), 500);
        
        // alert("Try again!"); // or just visual feedback
    }
}

function nextLevel() {
    if (currentLevelIndex < levels.length - 1) {
        loadLevel(currentLevelIndex + 1);
        switchScreen('game');
    } else {
        switchScreen('final');
    }
}

// Background Hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 4 + "s";
    
    document.querySelector('.hearts-container').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

setInterval(createHeart, 400);

// CSS Shake
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
.shake {
  animation: shake 0.4s ease-in-out;
  border-color: red;
}
`;
document.head.appendChild(style);
