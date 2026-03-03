// Load saved message on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedMessage = localStorage.getItem('birthdayMessage');
    if (savedMessage) {
        displayMessage(savedMessage);
    }
});

function editMessage() {
    const messageDiv = document.getElementById('yourMessage');
    const textarea = document.getElementById('messageInput');
    const editBtn = messageDiv.querySelector('.edit-btn');
    const saveBtn = messageDiv.querySelector('.save-btn');
    
    textarea.style.display = 'block';
    saveBtn.style.display = 'block';
    editBtn.style.display = 'none';
    
    const existingMessage = messageDiv.querySelector('p');
    if (existingMessage && !existingMessage.textContent.includes('Click the button')) {
        textarea.value = existingMessage.textContent;
    }
    
    textarea.focus();
}

function saveMessage() {
    const textarea = document.getElementById('messageInput');
    const message = textarea.value.trim();
    
    if (message === '') {
        alert('Please write a message!');
        return;
    }
    
    localStorage.setItem('birthdayMessage', message);
    displayMessage(message);
}

function displayMessage(message) {
    const messageDiv = document.getElementById('yourMessage');
    const textarea = document.getElementById('messageInput');
    const editBtn = messageDiv.querySelector('.edit-btn');
    const saveBtn = messageDiv.querySelector('.save-btn');
    
    messageDiv.innerHTML = `
        <p style="font-size: 1.1em; line-height: 1.8; color: #333; font-style: italic;">
            "${message}"
        </p>
        <button class="edit-btn" onclick="editMessage()">Edit Message</button>
    `;
    
    textarea.style.display = 'none';
    saveBtn.style.display = 'none';
}

// Confetti Effect
function triggerCelebration() {
    createConfetti();
    playSound();
}

function createConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    const colors = ['#667eea', '#764ba2', '#ff6b9d', '#ffa502', '#26de81'];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: Math.random() * 5 + 5
            },
            size: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationVelocity: (Math.random() - 0.5) * 0.2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let particlesAlive = false;
        
        particles.forEach(particle => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.velocity.y += 0.2; // gravity
            particle.rotation += particle.rotationVelocity;
            
            if (particle.y < canvas.height) {
                particlesAlive = true;
                
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
            }
        });
        
        if (particlesAlive) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

function playSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);
        
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.2);
    });
}

// Handle window resize for confetti
window.addEventListener('resize', function() {
    const canvas = document.getElementById('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
