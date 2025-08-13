document.addEventListener('DOMContentLoaded', () => {
    // Function to wrap text content for word-by-word animation
    const wrapWords = (element) => {
        const initialTextSpan = element.querySelector('.initial-text');
        if (!initialTextSpan) return; // Only process if .initial-text exists

        const text = initialTextSpan.innerHTML;
        let wrappedText = '';
        // Split by space, but keep HTML tags intact for strong elements etc.
        const parts = text.split(/(<[^>]+>|\s+)/);

        parts.forEach((part) => {
            if (part.startsWith('<') && part.endsWith('>')) {
                // It's an HTML tag, add it directly without wrapping
                wrappedText += part;
            } else if (part.trim() === '') {
                // It's just whitespace, add it directly
                wrappedText += part;
            } else {
                // It's a word, wrap it in a span
                wrappedText += `<span style="opacity:0;">${part}</span>`;
            }
        });
        element.innerHTML = wrappedText;
    };

    // Function to animate words one by one
    const animateWords = (element) => {
        const words = element.querySelectorAll('span');
        words.forEach((word, index) => {
            setTimeout(() => {
                word.style.opacity = '1';
            }, index * 20); // Even faster delay (20ms per word)
        });
    };

    // Setup Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // For word-by-word paragraphs
                if (entry.target.classList.contains('word-by-word')) {
                    animateWords(entry.target);
                }
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Prepare word-by-word elements BEFORE observing them
    const wordByWordTargets = document.querySelectorAll('.word-by-word');
    wordByWordTargets.forEach(target => {
        wrapWords(target);
        // Observe these elements
        observer.observe(target);
    });
});
