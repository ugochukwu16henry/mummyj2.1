// Directory page functionality
const dataURL = "data/members.json";
const membersContainer = document.querySelector("#members-container");
const gridButton = document.querySelector("#grid-view-btn");
const listButton = document.querySelector("#list-view-btn");

let companiesData = [];

// Main data fetching function
async function getMemberData() {
  try {
    const response = await fetch(dataURL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.companies || !Array.isArray(data.companies)) {
      throw new Error('Invalid data format');
    }
    
    companiesData = data.companies;
    displayMembers(companiesData, "grid");
    
  } catch (error) {
    console.error("Error fetching member data:", error);
    displayError();
  }
}

// Display error message
function displayError() {
  if (membersContainer) {
    membersContainer.innerHTML = `
      <div class="error-message" role="alert">
        <h2>Unable to Load Business Directory</h2>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    `;
  }
}

// Dynamic display function
function displayMembers(companies, viewType) {
  if (!membersContainer) return;
  
  membersContainer.innerHTML = "";
  membersContainer.className = viewType;

  if (!Array.isArray(companies) || companies.length === 0) {
    membersContainer.innerHTML = `
      <div class="no-data-message">
        <h2>No Businesses Found</h2>
        <p>Check back later for business listings.</p>
      </div>
    `;
    return;
  }

  companies.forEach((company) => {
    if (!company || typeof company !== 'object') {
      console.warn('Invalid company data:', company);
      return;
    }

    const memberCard = document.createElement("article");
    memberCard.classList.add("member-card");
    memberCard.setAttribute("role", "article");

    // Sanitize data
    const name = escapeHtml(company.name || 'Unknown Business');
    const address = escapeHtml(company.address || 'Address not available');
    const phone = escapeHtml(company.phone || 'Phone not available');
    const website = escapeHtml(company.website || '#');
    const imagefile = escapeHtml(company.imagefile || 'placeholder.jpg');
    const otherinfo = escapeHtml(company.otherinfo || 'No additional information');

    // Determine membership level
    let levelText = "Basic Member";
    let levelClass = "level-1";
    
    if (company.membershiplevel === 3) {
      levelText = "🥇 Gold Member";
      levelClass = "level-3";
    } else if (company.membershiplevel === 2) {
      levelText = "🥈 Silver Member";
      levelClass = "level-2";
    } else if (company.membershiplevel === 1) {
      levelText = "🥉 Bronze Member";
      levelClass = "level-1";
    }

    memberCard.innerHTML = `
      <div class="member-image">
        <img src="images/${imagefile}" 
             alt="${name} logo" 
             loading="lazy"
             onerror="this.src='images/placeholder.jpg'; this.alt='Logo not available';">
      </div>
      <div class="member-info">
        <h3>${name}</h3>
        <p class="membership-level ${levelClass}">${levelText}</p>
        <p class="member-address"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${address}</p>
        <p class="member-phone"><i class="fas fa-phone" aria-hidden="true"></i> ${phone}</p>
        <p class="member-website">
          <i class="fas fa-globe" aria-hidden="true"></i> 
          <a href="${website}" target="_blank" rel="noopener noreferrer">${website.replace('https://', '').replace('http://', '')}</a>
        </p>
        <p class="member-info-text">${otherinfo}</p>
      </div>
    `;

    membersContainer.appendChild(memberCard);
  });
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// View toggle functionality
function setupViewToggle() {
  if (!gridButton || !listButton) {
    console.warn('View toggle buttons not found');
    return;
  }

  gridButton.addEventListener("click", () => {
    if (membersContainer) {
      membersContainer.className = "grid";
      gridButton.classList.add("active");
      listButton.classList.remove("active");
    }
  });

  listButton.addEventListener("click", () => {
    if (membersContainer) {
      membersContainer.className = "list";
      listButton.classList.add("active");
      gridButton.classList.remove("active");
    }
  });

  // Set initial active state
  gridButton.classList.add("active");
}

// Update last modified date
function updateLastModified() {
  const lastModified = document.getElementById("last-modified");
  if (lastModified) {
    lastModified.textContent = "Last Modification: " + document.lastModified;
  }
}

// Initialize directory page
function initializeDirectory() {
  try {
    getMemberData();
    setupViewToggle();
    updateLastModified();
  } catch (error) {
    console.error('Error initializing directory:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeDirectory);