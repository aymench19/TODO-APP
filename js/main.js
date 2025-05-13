document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new TaskManager();
});
async function fetchRandomQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        const data = await response.json();
        return {
            content: data.content,
            author: data.author
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de la citation:', error);
        return {
            content: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.",
            author: "Winston Churchill"
        };
    }
}

async function displayNewQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    quoteElement.textContent = 'Chargement...';
    
    const quote = await fetchRandomQuote();
    quoteElement.innerHTML = `"${quote.content}" <br><small>- ${quote.author}</small>`;
}

document.getElementById('new-quote-btn')?.addEventListener('click', displayNewQuote);

window.addEventListener('DOMContentLoaded', displayNewQuote);