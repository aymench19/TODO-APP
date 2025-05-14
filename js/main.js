document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new TaskManager();
    displayNewQuote(); 
});

async function fetchRandomQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random', {
            cache: 'no-store' 
        });
        
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        
        const data = await response.json();
        return {
            content: data.content,
            author: data.author
        };
    } catch (error) {
        console.error('Erreur API, utilisation de citation locale:', error);
        const fallbackQuotes = [
            {
                content: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.",
                author: "Winston Churchill"
            },
            {
                content: "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre.",
                author: "Albert Einstein"
            }
        ];
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

async function displayNewQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    if (!quoteElement) return;
    
    quoteElement.innerHTML = '<div class="loading">Chargement...</div>';
    
    try {
        const quote = await fetchRandomQuote();
        quoteElement.innerHTML = `"${quote.content}" <br><small>- ${quote.author}</small>`;
    } catch (error) {
        quoteElement.innerHTML = 'Impossible de charger une citation.';
        console.error(error);
    }
}

const newQuoteBtn = document.getElementById('new-quote-btn');
if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', displayNewQuote);
}