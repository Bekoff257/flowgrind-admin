const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const quoteForm = document.querySelector('#quote-form');
const quotesList = document.querySelector('#quotes-list');

const API_URL = 'https://680ce6c32ea307e081d56142.mockapi.io/api/v1/quotes';

// POST - Add a new quote
quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newQuote = {
        title: titleInput.value,
        description: descriptionInput.value,
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuote),
        });

        titleInput.value = '';
        descriptionInput.value = '';
        fetchQuotes();
    } catch (error) {
        console.error('Error adding quote:', error);
    }
});

// GET - Fetch all quotes
async function fetchQuotes() {
    try {
        const response = await fetch(API_URL);
        const quotes = await response.json();

        quotesList.innerHTML = '';

        quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.className = 'quote';
            quoteDiv.innerHTML = `
                <h3>${quote.title}</h3>
                <p>${quote.description}</p>
                <div class="actions">
                    <button class="edit-btn" onclick="editQuote('${quote.id}', '${quote.title}', '${quote.description}')">Edit</button>
                    <button onclick="deleteQuote('${quote.id}')">Delete</button>
                </div>
            `;

            quotesList.appendChild(quoteDiv);
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// DELETE - Remove a quote
async function deleteQuote(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchQuotes();
    } catch (error) {
        console.error('Error deleting quote:', error);
    }
}

// PUT - Edit a quote
async function editQuote(id, oldTitle, oldDescription) {
    const newTitle = prompt('Edit title:', oldTitle);
    const newDescription = prompt('Edit description:', oldDescription);

    if (newTitle && newDescription) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, description: newDescription }),
            });
            fetchQuotes();
        } catch (error) {
            console.error('Error editing quote:', error);
        }
    }
}

// Load quotes on page load
fetchQuotes();
