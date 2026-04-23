// ===== PixelPets - Virtual Companion =====

let pet = {
    name: 'Kitty',
    emoji: '🐱',
    type: 'cat',
    level: 1,
    xp: 0,
    xpToNext: 100,
    happiness: 80,
    hunger: 60,
    energy: 90,
    isSleeping: false,
    isDancing: false
};

const petEmojis = { cat: '🐱', dog: '🐶', bunny: '🐰', panda: '🐼' };
const petSleepEmojis = { cat: '😺', dog: '🐕', bunny: '🐇', panda: '🐼' };
const moodEmojis = ['💕', '⭐', '🎉', '✨', '💖', '🌟', '🎵', '😍'];
const treatEmojis = ['🍎', '🍕', '🍩', '🧁', '🍪', '🍓', '🍦', '🥕'];

const bgAudio = document.getElementById('bg-audio');
const introScreen = document.getElementById('intro-screen');
const petScreen = document.getElementById('pet-screen');

// ===== Floating Background Stars =====
function initBgScene() {
    const scene = document.getElementById('bg-scene');
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255,255,255,${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite ${Math.random() * 2}s;
        `;
        scene.appendChild(star);
    }

    const style = document.createElement('style');
    style.textContent = `@keyframes twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }`;
    document.head.appendChild(style);
}
initBgScene();

// ===== Pet Selection =====
document.querySelectorAll('.pet-choice').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pet-choice').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pet.type = btn.dataset.pet;
        pet.emoji = btn.dataset.emoji;
        document.querySelector('.pet-bounce').textContent = pet.emoji;
    });
});

// ===== Start =====
document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('pet-name-input').value.trim();
    pet.name = nameInput || 'Buddy';
    
    introScreen.classList.remove('active');
    petScreen.classList.add('active');

    document.getElementById('pet-name-label').textContent = pet.name;
    document.getElementById('pet-emoji').textContent = pet.emoji;

    bgAudio.volume = 0.3;
    bgAudio.play().catch(() => {});

    updateUI();
    startDecay();
});

// ===== Actions =====
document.getElementById('btn-feed').addEventListener('click', () => doAction('feed'));
document.getElementById('btn-play').addEventListener('click', () => doAction('play'));
document.getElementById('btn-pet').addEventListener('click', () => doAction('pet'));
document.getElementById('btn-sleep').addEventListener('click', () => doAction('sleep'));
document.getElementById('btn-dance').addEventListener('click', () => doAction('dance'));

// Click on pet
document.getElementById('pet-sprite').addEventListener('click', () => {
    doAction('pet');
    spawnClickParticle();
});

function doAction(action) {
    const sprite = document.getElementById('pet-sprite');
    
    // Remove any ongoing animations
    sprite.className = 'pet-sprite';
    pet.isDancing = false;
    pet.isSleeping = false;

    switch (action) {
        case 'feed':
            pet.hunger = Math.min(100, pet.hunger + 25);
            pet.happiness = Math.min(100, pet.happiness + 5);
            pet.xp += 10;
            sprite.classList.add('eating');
            showMoodBubble('😋');
            setTimeout(() => sprite.classList.remove('eating'), 600);
            break;

        case 'play':
            if (pet.energy < 15) {
                showMoodBubble('😴');
                return;
            }
            pet.happiness = Math.min(100, pet.happiness + 20);
            pet.energy = Math.max(0, pet.energy - 15);
            pet.hunger = Math.max(0, pet.hunger - 10);
            pet.xp += 15;
            startMinigame();
            break;

        case 'pet':
            pet.happiness = Math.min(100, pet.happiness + 10);
            pet.xp += 5;
            sprite.classList.add('happy');
            showMoodBubble(moodEmojis[Math.floor(Math.random() * moodEmojis.length)]);
            setTimeout(() => sprite.classList.remove('happy'), 500);
            break;

        case 'sleep':
            pet.isSleeping = true;
            sprite.classList.add('sleeping');
            showMoodBubble('💤');
            // Recover energy over time
            const sleepInterval = setInterval(() => {
                if (!pet.isSleeping) {
                    clearInterval(sleepInterval);
                    return;
                }
                pet.energy = Math.min(100, pet.energy + 5);
                pet.xp += 2;
                updateUI();
                if (pet.energy >= 100) {
                    pet.isSleeping = false;
                    sprite.classList.remove('sleeping');
                    showMoodBubble('😊');
                    clearInterval(sleepInterval);
                }
            }, 1000);
            break;

        case 'dance':
            if (pet.energy < 10) {
                showMoodBubble('😴');
                return;
            }
            pet.isDancing = true;
            pet.happiness = Math.min(100, pet.happiness + 15);
            pet.energy = Math.max(0, pet.energy - 10);
            pet.xp += 12;
            sprite.classList.add('dancing');
            showMoodBubble('🎵');
            setTimeout(() => {
                sprite.classList.remove('dancing');
                pet.isDancing = false;
            }, 3000);
            break;
    }

    checkLevelUp();
    updateUI();
}

// ===== Level Up =====
function checkLevelUp() {
    while (pet.xp >= pet.xpToNext) {
        pet.xp -= pet.xpToNext;
        pet.level++;
        pet.xpToNext = Math.floor(pet.xpToNext * 1.5);
        showMoodBubble('🎉');
        
        // Flash effect
        const sprite = document.getElementById('pet-sprite');
        sprite.style.filter = 'brightness(2)';
        setTimeout(() => sprite.style.filter = '', 500);
    }
}

// ===== UI Update =====
function updateUI() {
    document.getElementById('bar-happiness').style.width = pet.happiness + '%';
    document.getElementById('bar-hunger').style.width = pet.hunger + '%';
    document.getElementById('bar-energy').style.width = pet.energy + '%';
    document.getElementById('pet-level').textContent = `Lv. ${pet.level}`;
    document.getElementById('xp-fill').style.width = `${(pet.xp / pet.xpToNext) * 100}%`;
    document.getElementById('xp-text').textContent = `${pet.xp} / ${pet.xpToNext} XP`;

    // Change bar colors based on values
    const hBar = document.getElementById('bar-happiness');
    const huBar = document.getElementById('bar-hunger');
    const eBar = document.getElementById('bar-energy');

    if (pet.happiness < 30) hBar.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
    else hBar.style.background = '';
    if (pet.hunger < 20) huBar.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
    else huBar.style.background = '';
    if (pet.energy < 20) eBar.style.background = 'linear-gradient(90deg, #ff0000, #ff4444)';
    else eBar.style.background = '';

    // Pet mood expression
    const emoji = document.getElementById('pet-emoji');
    if (pet.happiness < 20 || pet.hunger < 15) {
        emoji.textContent = '😢';
    } else if (pet.isSleeping) {
        emoji.textContent = '😴';
    } else {
        emoji.textContent = pet.emoji;
    }
}

// ===== Stat Decay =====
function startDecay() {
    setInterval(() => {
        if (!pet.isSleeping) {
            pet.hunger = Math.max(0, pet.hunger - 2);
            pet.happiness = Math.max(0, pet.happiness - 1);
            pet.energy = Math.max(0, pet.energy - 0.5);
        }
        updateUI();
    }, 3000);
}

// ===== Mood Bubble =====
function showMoodBubble(emoji) {
    const bubble = document.getElementById('mood-bubble');
    bubble.textContent = emoji;
    bubble.classList.add('visible');
    setTimeout(() => bubble.classList.remove('visible'), 1500);
}

// ===== Click Particles =====
function spawnClickParticle() {
    const container = document.getElementById('pet-area');
    const emoji = moodEmojis[Math.floor(Math.random() * moodEmojis.length)];
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
    particle.style.top = `${40 + (Math.random() - 0.5) * 20}%`;
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 800);
}

// ===== Mini Game =====
let minigameScore = 0;
let minigameTarget = 5;
let minigameActive = false;

function startMinigame() {
    minigameScore = 0;
    minigameActive = true;
    document.getElementById('minigame-score').textContent = '0';
    document.getElementById('minigame-overlay').classList.remove('hidden');
    document.getElementById('minigame-area').innerHTML = '';
    spawnTreat();
}

function spawnTreat() {
    if (!minigameActive || minigameScore >= minigameTarget) {
        endMinigame();
        return;
    }

    const area = document.getElementById('minigame-area');
    const treat = document.createElement('div');
    treat.className = 'minigame-treat';
    treat.textContent = treatEmojis[Math.floor(Math.random() * treatEmojis.length)];
    treat.style.left = `${Math.random() * 70 + 10}%`;
    treat.style.top = `${Math.random() * 60 + 15}%`;

    treat.addEventListener('click', () => {
        minigameScore++;
        document.getElementById('minigame-score').textContent = minigameScore;
        treat.remove();
        if (minigameScore >= minigameTarget) {
            endMinigame();
        } else {
            setTimeout(spawnTreat, 300);
        }
    });

    area.appendChild(treat);

    // Remove if not clicked in time
    setTimeout(() => {
        if (treat.parentNode && minigameActive) {
            treat.remove();
            spawnTreat();
        }
    }, 2000);
}

function endMinigame() {
    minigameActive = false;
    const bonus = minigameScore * 5;
    pet.happiness = Math.min(100, pet.happiness + bonus);
    pet.xp += bonus;
    checkLevelUp();
    updateUI();

    setTimeout(() => {
        document.getElementById('minigame-overlay').classList.add('hidden');
        showMoodBubble(minigameScore >= minigameTarget ? '🏆' : '👍');
    }, 500);
}
