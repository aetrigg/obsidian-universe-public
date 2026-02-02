function randomQuote() {
    return fetch('https://raw.githubusercontent.com/Zachatoo/quotes-database/main/quotes.json')
      .then(response => response.json())
      .then(quotes => {
        // Get random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // Format with Markdown blockquote syntax (handling both 'quote' and 'text' properties)
        const quoteText = randomQuote.quote || randomQuote.text;
        return `> ${quoteText}\n> <cite>~ ${randomQuote.author}</cite>`;
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
        return `> Could not load quote. Please check your internet connection.\n> <cite>~ Error</cite>`;
      });
  }
  
  module.exports = randomQuote;