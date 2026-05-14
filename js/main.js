document.addEventListener('DOMContentLoaded', () => {
    
    // 1. TEXT SCRAMBLE / MORPH EFFECT (Core to Aino Agency's "Text as a medium" aesthetic)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    
    const elementsToScramble = document.querySelectorAll('[data-scramble]');

    elementsToScramble.forEach(element => {
        element.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = event.target.dataset.scramble;
            
            // Freeze element dimensions to prevent layout shifting during scramble
            if (!element.isScrambling) {
                const rect = element.getBoundingClientRect();
                element.style.width = `${rect.width}px`;
                element.style.height = `${rect.height}px`;
                element.style.whiteSpace = 'nowrap';
                element.isScrambling = true;
            }

            clearInterval(element.scrambleInterval);
            
            element.scrambleInterval = setInterval(() => {
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        // Keep spaces as spaces
                        if (letter === " ") return " ";
                        // Reveal original letter if iteration has passed it
                        if (index < iterations) {
                            return originalText[index];
                        }
                        // Otherwise random character
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");
                
                if (iterations >= originalText.length) {
                    clearInterval(element.scrambleInterval);
                    
                    // Release the fixed dimensions once done
                    element.style.width = '';
                    element.style.height = '';
                    element.style.whiteSpace = '';
                    element.isScrambling = false;
                }
                
                iterations += 1 / 3; // speed of deciphering
            }, 30);
        });
    });

    // 2. ASCII BLOB PARALLAX & CONTINUOUS FLOAT (Wider dynamic range & physics)
    const asciiBlob = document.querySelector('.ascii-blob');
    if (asciiBlob) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // Catch mouse movement for a much wider parallax spread
        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 300; // Increased from 40 to 300
            targetY = (e.clientY / window.innerHeight - 0.5) * 300; 
        });

        const animateBlob = () => {
            const time = performance.now() * 0.001;
            
            // Add a continuous floating sine-wave motion so it breathes even when idle
            const floatX = Math.sin(time * 0.5) * 80; 
            const floatY = Math.cos(time * 0.7) * 80;
            const floatRotate = Math.sin(time * 0.3) * 5; // Slight rotation
            const floatScale = 1 + (Math.sin(time * 0.4) * 0.05); // Slight breathing/scaling
            
            // Smooth easing towards the target mouse position
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            // Apply the combined transforms
            asciiBlob.style.transform = `translate(${mouseX + floatX}px, ${mouseY + floatY}px) rotate(${floatRotate}deg) scale(${floatScale})`;
            
            requestAnimationFrame(animateBlob);
        };
        
        animateBlob();
    }
});