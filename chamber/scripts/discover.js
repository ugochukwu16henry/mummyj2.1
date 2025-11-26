import { discoverItems } from '../data/discover-items.mjs';

// Display visit message based on localStorage
function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    const messageElement = document.getElementById('visit-message');
    
    if (!lastVisit) {
        messageElement.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysDifference = Math.floor((currentDate - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            messageElement.textContent = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            messageElement.textContent = "You last visited 1 day ago.";
        } else {
            messageElement.textContent = `You last visited ${daysDifference} days ago.`;
        }
    }
    
    // Store current visit date
    localStorage.setItem('lastVisit', currentDate.toString());
}

// Create discover cards
function createDiscoverCards() {
    const grid = document.getElementById('discover-grid');
    
    discoverItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'discover-card';
        
        card.innerHTML = `
            <h2>${item.name}</h2>
            <figure>
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </figure>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <button class="learn-more-btn">Learn More</button>
        `;
        
        grid.appendChild(card);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayVisitMessage();
    createDiscoverCards();
    
    // Update last modified date
    const lastModified = document.getElementById('last-modified');
    if (lastModified) {
        lastModified.textContent = `Last Modification: ${document.lastModified}`;
    }
});