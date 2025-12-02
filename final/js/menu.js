// menu.js
// Dynamic menu loading and display functionality
import { openModal } from "./modal.js";

export async function loadMenu(container) {
  if (!container) {
    console.error("Menu container not found");
    return;
  }

  // Show loading state
  container.innerHTML = '<p class="loading">Loading menu...</p>';

  try {
    // Fetch JSON file - handle GitHub Pages path resolution
    // Get the directory of the current HTML file
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const jsonPath = `${basePath}data/Menu.json`;
    
    const res = await fetch(jsonPath);
    
    if (!res.ok) {
      const errorMsg = `Failed to load menu: ${res.status} ${res.statusText}`;
      const resolvedUrl = new URL(jsonPath, window.location.origin).href;
      console.error("Fetch Error Details:");
      console.error("- Current URL:", window.location.href);
      console.error("- Current path:", currentPath);
      console.error("- Base path:", basePath);
      console.error("- Attempted path:", jsonPath);
      console.error("- Full resolved URL:", resolvedUrl);
      console.error("- Response status:", res.status, res.statusText);
      throw new Error(errorMsg);
    }
    
    const items = await res.json();

    // Validate data structure
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Menu data is empty or invalid");
    }

    // Generate menu cards with proper accessibility
    container.innerHTML = items
      .map(
        (item) => `
      <article class="card" tabindex="0" role="article" aria-label="${item.name}">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div style="padding:1rem;">
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <p class="price">${item.price}</p>
          <button data-modal="${item.id}" class="view-details" aria-label="View details for ${item.name}">View Details</button>
        </div>
      </article>
    `
      )
      .join("");

    // Attach modal open handlers after cards are created
    document.querySelectorAll("[data-modal]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(btn.dataset.modal, items);
      });
      
      // Keyboard accessibility - Enter key support
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(btn.dataset.modal, items);
        }
      });
    });

    // Add keyboard navigation for cards
    container.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const button = card.querySelector("[data-modal]");
          if (button) {
            button.click();
          }
        }
      });
    });

  } catch (err) {
    console.error("Error loading menu:", err);
    container.innerHTML = `
      <div class="loading" style="color:#dc3545;">
        <p><strong>Error loading menu:</strong> ${err.message}</p>
        <p>Please refresh the page or contact us if the problem persists.</p>
      </div>
    `;
  }
}
