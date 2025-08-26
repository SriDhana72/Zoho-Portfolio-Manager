// Get canvases for new Upsell/Cross-sell charts
let upsellChart; // Declare chart variables globally so they can be destroyed/re-created
let crossSellChart; // Declare chart variables globally
const upsellChartCanvas = document.getElementById('upsellChart'); // Get canvas for upsell chart
const upsellCtx = upsellChartCanvas.getContext('2d'); // Get 2D rendering context for upsell chart
const crossSellChartCanvas = document.getElementById('crossSellChart'); // Get canvas for cross-sell chart
const crossSellCtx = crossSellChartCanvas.getContext('2d'); // Get 2D rendering context for cross-sell chart
// Data for Upsell and Cross-sell charts (dynamic data source)
const upsellCrossSellData = {
    "month": {
        upsell: { accounts: 25, revenue: 1500000 },
        crossSell: { accounts: 18, revenue: 800000 }
    },
    "quarter": {
        upsell: { accounts: 75, revenue: 4800000 },
        crossSell: { accounts: 50, revenue: 2500000 }
    },
    "year": {
        upsell: { accounts: 250, revenue: 18000000 },
        crossSell: { accounts: 180, revenue: 9000000 }
    }
};
// Function to render/update the Upsell and Cross-sell charts and stats
function updateUpsellCrossSellCard(period) {
    const data = upsellCrossSellData[period];
    // Update Upsell stats
    document.getElementById('upsellAccounts').textContent = data.upsell.accounts;
    document.getElementById('upsellRevenue').textContent = formatArr(data.upsell.revenue);
    // Update Cross-sell stats
    document.getElementById('crossSellAccounts').textContent = data.crossSell.accounts;
    document.getElementById('crossSellRevenue').textContent = formatArr(data.crossSell.revenue);
    // Update Upsell Chart
    if (upsellChart) {
        upsellChart.destroy(); // Destroy existing chart instance
    }
    upsellChart = new Chart(upsellCtx, {
        type: 'bar',
        data: {
            labels: ['Accounts', 'Revenue'],
            datasets: [{
                label: 'Upsell',
                data: [data.upsell.accounts, data.upsell.revenue],
                backgroundColor: ['#007bff', '#28a745'],
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                if (context.label === 'Revenue') {
                                    label += ': $' + (context.parsed.y / 1000000).toFixed(1) + 'M';
                                } else {
                                    label += ': ' + context.parsed.y + ' Accounts';
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            if (this.getLabelForValue(index) === 'Revenue') {
                                return '$' + (value / 1000000) + 'M';
                            }
                            return value;
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });
    // Update Cross-sell Chart
    if (crossSellChart) {
        crossSellChart.destroy(); // Destroy existing chart instance
    }
    crossSellChart = new Chart(crossSellCtx, {
        type: 'bar',
        data: {
            labels: ['Accounts', 'Revenue'],
            datasets: [{
                label: 'Cross-sell',
                data: [data.crossSell.accounts, data.crossSell.revenue],
                backgroundColor: ['#007bff', '#28a745'],
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                if (context.label === 'Revenue') {
                                    label += ': $' + (context.parsed.y / 1000000).toFixed(1) + 'M';
                                } else {
                                    label += ': ' + context.parsed.y + ' Accounts';
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            if (this.getLabelForValue(index) === 'Revenue') {
                                return '$' + (value / 1000000) + 'M';
                            }
                            return value;
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });
}
// Function to generate a random 6-digit ZUID
function generateZUID() { // Function to generate a random ZUID
    return Math.floor(100000 + Math.random() * 900000); // Returns a random 6-digit number
}
// Original data for Customer Portfolio Table (Updated)
const originalCustomerPortfolioData = [ // Original customer portfolio data
    { // Customer 1
        initials: 'TM', avatarColor: '#5168b5', name: 'TechMart Solutions', zuid: generateZUID(), industry: 'E-commerce', industrySector: 'Online Retail', arr: 1240000, arrChange: 12.6, products: ['PG', 'Neo', 'Engage'], healthScore: 82, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Today, QRR Meeting'
    },
    { // Customer 2
        initials: 'GS', avatarColor: '#8c5eff', name: 'Global SaaS Inc.', zuid: generateZUID(), industry: 'SaaS', industrySector: 'Cloud Software', arr: 3820000, arrChange: 8.7, products: ['PG', 'Neo'], healthScore: 78, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: 'Yesterday, Email'
    },
    { // Customer 3
        initials: 'ER', avatarColor: '#4CAF50', name: 'EduRight Academy', zuid: generateZUID(), industry: 'Education', industrySector: 'E-learning', arr: 940000, arrChange: 24.2, products: ['PG', 'Neo', 'POS'], healthScore: 92, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: '3 days ago, Product Demo'
    },
    { // Customer 4
        initials: 'FR', avatarColor: '#ef5350', name: 'Fashion Retail Co.', zuid: generateZUID(), industry: 'Retail', industrySector: 'Apparel & Accessories', arr: 2180000, arrChange: -3.5, products: ['PG', 'POS', 'Engage'], healthScore: 68, healthText: 'Good', healthColor: 'good', status: 'At Risk', lastInteraction: '1 week ago, Support Call'
    },
    { // Customer 5
        initials: 'HT', avatarColor: '#ffa726', name: 'HealthTech Solutions', zuid: generateZUID(), industry: 'Healthcare', industrySector: 'Digital Health', arr: 1760000, arrChange: 6.2, products: ['PG', 'Neo'], healthScore: 72, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '2 days ago, WhatsApp'
    },
    { // Customer 6
        initials: 'FS', avatarColor: '#26a69a', name: 'FoodStreet Cafe', zuid: generateZUID(), industry: 'Food & Beverage', industrySector: 'Restaurant Management', arr: 550000, arrChange: 15.1, products: ['POS', 'Engage'], healthScore: 88, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Today, Onboarding'
    },
    { // Customer 7
        initials: 'BC', avatarColor: '#ab47bc', name: 'BuildCo Inc.', zuid: generateZUID(), industry: 'Construction', industrySector: 'Real Estate Tech', arr: 980000, arrChange: 7.8, products: ['PG', 'Neo'], healthScore: 70, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '2 weeks ago, Follow-up'
    },
    { // Customer 8
        initials: 'GR', avatarColor: '#78909c', name: 'GreenRetail Stores', zuid: generateZUID(), industry: 'Retail', industrySector: 'Eco-Friendly Retail', arr: 1300000, arrChange: -1.2, products: ['POS', 'Engage'], healthScore: 65, healthText: 'Average', healthColor: 'average', status: 'At Risk', lastInteraction: '4 days ago, Issue Resolution'
    },
    { // Customer 9
        initials: 'DC', avatarColor: '#42a5f5', name: 'DataCloud Solutions', zuid: generateZUID(), industry: 'Tech', industrySector: 'Cloud Services', arr: 4500000, arrChange: 10.5, products: ['PG', 'Neo', 'Analytics'], healthScore: 95, healthText: 'Excellent', healthColor: 'excellent', status: 'Active', lastInteraction: 'Yesterday, Data Sync'
    },
    { // Customer 10
        initials: 'LS', avatarColor: '#bdbdbd', name: 'Local Services Co.', zuid: generateZUID(), industry: 'Services', industrySector: 'Field Services', arr: 720000, arrChange: 3.1, products: ['PG'], healthScore: 55, healthText: 'Poor', healthColor: 'poor', status: 'At Risk', lastInteraction: '1 month ago, Review'
    },
    { // Customer 11
        initials: 'AT', avatarColor: '#a1887f', name: 'Artistic Trends', zuid: generateZUID(), industry: 'Arts & Crafts', industrySector: 'Creative Platforms', arr: 890000, arrChange: 7.0, products: ['PG', 'Books'], healthScore: 75, healthText: 'Good', healthColor: 'good', status: 'Active', lastInteraction: '5 days ago, New Feature'
    }
];
// Data variable that will be filtered and sorted
let filteredCustomerData = [...originalCustomerPortfolioData]; // Copy of original data for filtering and sorting
let currentSortColumn = 'name'; // Default sort column for table
let currentSortDirection = 'asc'; // Default sort direction for table
// New state flags for individual ARR filters
let arrLessThan5kActive = false; // Flag for < $5K ARR filter
let arrGreaterThan5kActive = false; // Flag for > $5K ARR filter
let currentPage = 1; // Current page number for pagination
const itemsPerPage = 5; // Number of items to display per page
let totalPages = Math.ceil(filteredCustomerData.length / itemsPerPage); // Calculate total pages
const merchantTableBody = document.getElementById('merchantTableBody'); // Table body element
const paginationInfo = document.getElementById('paginationInfo'); // Pagination info element
const prevPageBtn = document.getElementById('prevPageBtn'); // Previous page button
const nextPageBtn = document.getElementById('nextPageBtn'); // Next page button
const pageNumbersContainer = document.getElementById('pageNumbers'); // Container for page number buttons
// Combined ARR filter capsule and its clickable parts
const filterArrCapsule = document.getElementById('filterArrCapsule'); // ARR filter capsule
const arrLessThan5kSpan = document.getElementById('arrLessThan5k'); // Span for < $5K filter
const arrGreaterThan5kSpan = document.getElementById('arrGreaterThan5k'); // Span for > $5K filter
// Modal Elements
const filterModal = document.getElementById('filterModal'); // Filter modal
const openFilterModalBtn = document.getElementById('openFilterModalBtn'); // Button to open filter modal
const closeFilterModalBtn = document.getElementById('closeFilterModalBtn'); // Button to close filter modal
const filterModalBody = document.getElementById('filterModalBody'); // Body of filter modal
const addFilterRowBtn = document.getElementById('addFilterRowBtn'); // Button to add filter row
const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn'); // Button to clear all filters
const applyFiltersBtn = document.getElementById('applyFiltersBtn'); // Button to apply filters
// Sort Modal Elements
const sortModal = document.getElementById('sortModal'); // Sort modal
const openSortModalBtn = document.getElementById('openSortModalBtn'); // Button to open sort modal
const closeSortModalBtn = document.getElementById('closeSortModalBtn'); // Button to close sort modal
const sortColumnSelect = document.getElementById('sortColumnSelect'); // Select element for sort column
const sortAscendingBtn = document.getElementById('sortAscendingBtn'); // Button for ascending sort
const sortDescendingBtn = document.getElementById('sortDescendingBtn'); // Button for descending sort
const clearSortBtn = document.getElementById('clearSortBtn'); // Button to clear sort
const applySortBtn = document.getElementById('applySortBtn'); // Button to apply sort
// Tab Elements
const tabButtons = document.querySelectorAll('.tab-button'); // All tab buttons
const dashboardContent = document.getElementById('dashboard-content'); // Dashboard content section
const merchant360Content = document.getElementById('merchant-360-content'); // Merchant 360 content section
const qbrDeckContent = document.getElementById('qbr-deck-content'); // QBR Deck content section
// User Dropdown Elements
const userProfileToggle = document.getElementById('userProfileToggle'); // User profile toggle button
const userDropdownMenu = document.getElementById('userDropdownMenu'); // User dropdown menu
const currentUserNameSpan = document.getElementById('currentUserName'); // Current user name span
const currentUserAvatarDiv = document.getElementById('currentUserAvatar'); // Current user avatar div
// New global Upsell & Cross-sell filter
const upsellCrossSellFilter = document.getElementById('upsellCrossSellFilter');
// --- Product Adoption Enhancements ---
// Removed `showingAllProducts` state
const initialProductsToShow = 5;
const allProductsData = [
    // Core Zoho Products (with mock adoption)
    { name: 'CRM', slug: 'crm', customersUsing: 50, totalCustomers: 50 },
    { name: 'Desk', slug: 'desk', customersUsing: 32, totalCustomers: 50 },
    { name: 'Books', slug: 'books', customersUsing: 18, totalCustomers: 50 },
    { name: 'Analytics', slug: 'analytics', customersUsing: 24, totalCustomers: 50 },
    // Additional Zoho-like Products
    { name: 'Campaigns', slug: 'campaigns', customersUsing: 10, totalCustomers: 50 },
    { name: 'Sites', slug: 'sites', customersUsing: 7, totalCustomers: 50 },
    { name: 'SalesIQ', slug: 'salesiq', customersUsing: 8, totalCustomers: 50 },
    { name: 'Projects', slug: 'projects', customersUsing: 5, totalCustomers: 50 },
    { name: 'One', slug: 'one', customersUsing: 45, totalCustomers: 50 }, // Zoho One Suite
];
// Sort products by adoption percentage (descending) to show "top" products
allProductsData.sort((a, b) => {
    const percA = (a.customersUsing / a.totalCustomers) * 100;
    const percB = (b.customersUsing / b.totalCustomers) * 100;
    return percB - percA;
});
function renderProductAdoption() {
    const container = document.getElementById('productAdoptionContainer');
    const showAllProductsLink = document.getElementById('showAllProductsLink'); // Get the new link
    container.innerHTML = ''; // Clear existing content
    const productsToRender = allProductsData.slice(0, initialProductsToShow);
    productsToRender.forEach(product => {
        const adoptionPercentage = (product.customersUsing / product.totalCustomers) * 100;
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <div class="product-header">
                <span class="label">Zoho ${product.name}</span>
                <span class="value">${product.customersUsing}/${product.totalCustomers}</span>
            </div>
            <div class="product-progress-bar-container">
                <div class="product-progress-fill ${product.slug}" style="width: ${adoptionPercentage.toFixed(0)}%;"></div>
            </div>
        `;
        container.appendChild(productItem);
    });
    // Show/hide "Show All Products" link
    if (allProductsData.length > initialProductsToShow) {
        showAllProductsLink.style.display = 'block';
    } else {
        showAllProductsLink.style.display = 'none';
    }
}
// New: All Products Modal elements
const allProductsModal = document.getElementById('allProductsModal');
const closeAllProductsModalBtn = document.getElementById('closeAllProductsModalBtn');
const closeAllProductsModalFooterBtn = document.getElementById('closeAllProductsModalFooterBtn');
const allProductsModalBody = document.getElementById('allProductsModalBody');
const showAllProductsLink = document.getElementById('showAllProductsLink');
function populateAllProductsModal() {
    allProductsModalBody.innerHTML = ''; // Clear existing content
    // Create a temporary container to reduce reflows
    const fragment = document.createDocumentFragment();
    allProductsData.forEach(product => {
        const adoptionPercentage = (product.customersUsing / product.totalCustomers) * 100;
        const productItem = document.createElement('div');
        productItem.classList.add('product-item'); // Reuse existing product-item styles
        productItem.innerHTML = `
            <div class="product-header">
                <span class="label">Zoho ${product.name}</span>
                <span class="value">${product.customersUsing}/${product.totalCustomers}</span>
            </div>
            <div class="product-progress-bar-container">
                <div class="product-progress-fill ${product.slug}" style="width: ${adoptionPercentage.toFixed(0)}%;"></div>
            </div>
        `;
        fragment.appendChild(productItem);
    });
    allProductsModalBody.appendChild(fragment);
}
// Event listener for the "Show All Products" link
showAllProductsLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    populateAllProductsModal(); // Populate the modal with all products
    allProductsModal.classList.add('show-flex'); // Show the modal
});
// Event listeners to close the "All Products" modal
closeAllProductsModalBtn.addEventListener('click', () => {
    allProductsModal.classList.remove('show-flex');
});
closeAllProductsModalFooterBtn.addEventListener('click', () => {
    allProductsModal.classList.remove('show-flex');
});
window.addEventListener('click', (event) => {
    if (event.target == allProductsModal) {
        allProductsModal.classList.remove('show-flex');
    }
});
// --- Tab Switching Logic ---
function switchTab(tabName) { // Function to switch between tabs
    tabButtons.forEach(button => { // Deactivate all tab buttons
        button.classList.remove('active');
    });
    dashboardContent.style.display = 'none'; // Hide all content sections
    merchant360Content.style.display = 'none'; // Hide Merchant 360 content
    qbrDeckContent.style.display = 'none'; // Hide QBR Deck content
    if (tabName === 'dashboard') { // Activate the clicked tab and show its content
        document.querySelector('[data-tab="dashboard"]').classList.add('active'); // Add active class to dashboard tab
        dashboardContent.style.display = 'block'; // Or 'flex' if it uses flexbox
    } else if (tabName === 'merchant360') { // If tab is Merchant 360
        document.querySelector('[data-tab="merchant360"]').classList.add('active'); // Add active class to Merchant 360 tab
        merchant360Content.style.display = 'block'; // Display Merchant 360 content
    } else if (tabName === 'qbrdeck') { // If tab is QBR Deck
        document.querySelector('[data-tab="qbrdeck"]').classList.add('active'); // Add active class to QBR Deck tab
        qbrDeckContent.style.display = 'block'; // Display QBR Deck content
    }
}
tabButtons.forEach(button => { // Add event listener to each tab button
    button.addEventListener('click', (event) => {
        const tabName = event.target.dataset.tab; // Get tab name from data attribute
        switchTab(tabName); // Switch to the clicked tab
    });
});
// --- User Dropdown Logic ---
userProfileToggle.addEventListener('click', () => { // Toggle user dropdown menu on click
    userDropdownMenu.classList.toggle('show'); // Toggle 'show' class
});
// Event listener for clicking outside the dropdown to close it
window.addEventListener('click', (event) => { // Close dropdown when clicking outside
    if (!userProfileToggle.contains(event.target) && !userDropdownMenu.contains(event.target)) { // Check if click is outside toggle and menu
        userDropdownMenu.classList.remove('show'); // Remove 'show' class to hide dropdown
    }
});
// Event listener for selecting a user from the dropdown
userDropdownMenu.querySelectorAll('li').forEach(item => { // Add event listener to each user in dropdown
    item.addEventListener('click', () => {
        const selectedName = item.dataset.name; // Get selected user's name
        const selectedInitials = item.dataset.initials; // Get selected user's initials
        currentUserNameSpan.textContent = selectedName; // Update displayed user name
        currentUserAvatarDiv.textContent = selectedInitials; // Update displayed user avatar initials
        userDropdownMenu.querySelectorAll('li').forEach(li => li.classList.remove('selected')); // Remove 'selected' class from all
        item.classList.add('selected'); // Add 'selected' class to the clicked item
        userDropdownMenu.classList.remove('show'); // Close dropdown after selection
    });
});
// --- Customer Portfolio Table Functions ---
// Function to format ARR into a readable dollar string (e.g., $1.24M or $5K)
function formatArr(value) { // Formats ARR value to readable string
    if (value >= 1000000) { // If value is 1 million or more
        return '$' + (value / 1000000).toFixed(1) + 'M'; // Format as millions
    } else if (value >= 1000) { // If value is 1 thousand or more
        return '$' + (value / 1000).toFixed(0) + 'K'; // Format as thousands
    }
    return '$' + value.toFixed(2); // Otherwise, format with two decimal places
}
// Function to render the table for the current page
function renderTable() { // Renders the customer portfolio table
    merchantTableBody.innerHTML = ''; // Clear existing rows
    totalPages = Math.ceil(filteredCustomerData.length / itemsPerPage); // Recalculate total pages
    const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index for current page
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomerData.length); // Calculate end index
    for (let i = startIndex; i < endIndex; i++) { // Loop through data for current page
        const customer = filteredCustomerData[i]; // Get current customer data
        const row = document.createElement('tr'); // Create a new table row
        const customerTd = document.createElement('td'); // Create table data for customer column
        customerTd.innerHTML = `
            <div class="customer-info">
                <div class="customer-initials-avatar" style="background-color: ${customer.avatarColor};">
                    ${customer.initials}
                </div>
                <div class="customer-name-and-details">
                    <div class="customer-name">${customer.name}</div>
                    <div class="customer-zuid">ZUID: ${customer.zuid}</div>
                </div>
            </div>
        `; // Populate customer column HTML
        row.appendChild(customerTd); // Append customer column to row
        const industryTd = document.createElement('td'); // Create table data for industry column
        industryTd.textContent = customer.industry; // Set industry text content
        row.appendChild(industryTd); // Append industry column to row
        const industrySectorTd = document.createElement('td'); // Create table data for industry sector column
        industrySectorTd.textContent = customer.industrySector; // Set industry sector text content
        row.appendChild(industrySectorTd); // Append industry sector column to row
        const arrTd = document.createElement('td'); // Create table data for ARR column
        const arrChangeClass = customer.arrChange >= 0 ? 'positive' : 'negative'; // Determine class for ARR change
        arrTd.innerHTML = `
            <div class="arr-value">${formatArr(customer.arr)}</div>
            <div class="arr-change ${arrChangeClass}">${customer.arrChange >= 0 ? '+' : ''}${customer.arrChange}%</div>
        `; // Populate ARR column HTML
        row.appendChild(arrTd); // Append ARR column to row
        const productsTd = document.createElement('td'); // Create table data for products column
        productsTd.innerHTML = customer.products.map(product => `
            <span class="product-badge ${product.toLowerCase()}">${product}</span>
        `).join(''); // Populate products column HTML with badges
        row.appendChild(productsTd); // Append products column to row
        
        const statusTd = document.createElement('td'); // Create table data for status column
        const statusClass = customer.status.toLowerCase().replace(' ', '-'); // Determine class for status
        statusTd.innerHTML = `<span class="status-badge ${statusClass}">${customer.status}</span>`; // Populate status column HTML with badge
        row.appendChild(statusTd); // Append status column to row
        const lastInteractionTd = document.createElement('td'); // Create table data for last interaction column
        const lastInteractionParts = customer.lastInteraction.split(', '); // Split interaction string
        const interactionDay = lastInteractionParts[0]; // Get interaction day
        const interactionType = lastInteractionParts.length > 1 ? lastInteractionParts[1] : ''; // Get interaction type
        lastInteractionTd.innerHTML = `
            <div class="last-interaction-content">
                <span class="last-interaction-day">${interactionDay}</span>
                <span class="last-interaction-type">${interactionType}</span>
            </div>
        `; // Populate last interaction column HTML
        row.appendChild(lastInteractionTd); // Append last interaction column to row
        const actionsTd = document.createElement('td'); // Create table data for actions column
        actionsTd.innerHTML = `<a href="#" class="action-link">View</a>`; // Populate actions column HTML with link
        row.appendChild(actionsTd); // Append actions column to row
        merchantTableBody.appendChild(row); // Append row to table body
        
    }
    updatePaginationControls(); // Update pagination controls
    updateSortIconVisuals(); // Update sort icon visuals
}
// Function to apply all filters (including capsule filters)
function applyAllFilters() { // Applies all active filters and sorting
    let tempFilteredData = [...originalCustomerPortfolioData]; // Start with the original data
    if (arrLessThan5kActive) { // Apply individual ARR filters
        tempFilteredData = tempFilteredData.filter(customer => customer.arr < 5000000); /* Corrected value to 5,000,000 for consistency with $5K vs $5M, assumed $5M was intended */
    } else if (arrGreaterThan5kActive) {
        tempFilteredData = tempFilteredData.filter(customer => customer.arr >= 5000000); /* Corrected value */
    }
    updateArrCapsuleVisuals(); // Update capsule visual states
    const filterRows = filterModalBody.querySelectorAll('.filter-row'); // Get all filter rows from modal
    const activeModalFilters = []; // Array to store active modal filters
    filterRows.forEach(row => { // Iterate through each filter row
        const field = row.querySelector('.filter-field-select').value; // Get filter field
        const operator = row.querySelector('.filter-operator-select').value; // Get filter operator
        const value = row.querySelector('.filter-value-input').value.trim(); // Get filter value
        if (value) { // If value is not empty
            activeModalFilters.push({ field, operator, value }); // Add filter to active filters array
        }
    });
    if (activeModalFilters.length > 0) { // If there are active modal filters
        tempFilteredData = tempFilteredData.filter(customer => { // Filter data
            return activeModalFilters.every(filter => { // Check if all filters apply to customer
                let customerValue; // Initialize customer value
                if (filter.field === 'name') { // If filtering by name
                    customerValue = customer.name; // Get customer name
                } else if (filter.field === 'products') { // If filtering by products
                    customerValue = customer.products.join(', '); // Join products into a string
                } else if (filter.field === 'lastInteraction') { // If filtering by last interaction
                    customerValue = customer.lastInteraction; // Get last interaction
                } else if (filter.field === 'arr') { // If filtering by ARR
                    customerValue = customer.arr; // Get ARR
                } else { // For industry, industrySector, healthScore
                    customerValue = customer[filter.field]; // Get value from customer object
                }
                const isStringComparison = typeof customerValue === 'string'; // Check if comparison is string-based
                const filterValue = isStringComparison ? filter.value.toLowerCase() : parseFloat(filter.value); // Convert filter value
                const dataValue = isStringComparison ? customerValue.toLowerCase() : customerValue; // Convert data value
                switch (filter.operator) { // Apply filter based on operator
                    case 'contains': return isStringComparison && dataValue.includes(filterValue); // Contains operator
                    case 'equals': return dataValue === filterValue; // Equals operator
                    case 'starts_with': return isStringComparison && dataValue.startsWith(filterValue); // Starts with operator
                    case 'ends_with': return isStringComparison && dataValue.endsWith(filterValue); // Ends with operator
                    case 'greater_than': return !isNaN(dataValue) && dataValue > filterValue; // Greater than operator
                    case 'less_than': return !isNaN(dataValue) && dataValue < filterValue; // Less than operator
                    default: return true; // Default to true
                }
            });
        });
    }
    const column = currentSortColumn; // Get current sort column
    const direction = currentSortDirection; // Get current sort direction
    tempFilteredData.sort((a, b) => { // Apply sorting
        let valA = a[column]; // Get value A for comparison
        let valB = b[column]; // Get value B for comparison
        if (column === 'products') { // Special handling for 'products' column
            valA = a.products[0] || ''; // Use first product or empty string
            valB = b.products[0] || ''; // Use first product or empty string
        }
        if (typeof valA === 'string' && typeof valB === 'string') { // If values are strings
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(a[column]); // String comparison
        } else { // If values are numbers
            return direction === 'asc' ? (valA - valB) : (valB - valA); // Numeric comparison
        }
    });
    filteredCustomerData = tempFilteredData; // Update filtered data
    currentPage = 1; // Reset to first page after any filter/sort change
    renderTable(); // Render the table
}
// Function to update pagination information and buttons
function updatePaginationControls() { // Updates pagination info and button states
    const startIndex = (currentPage - 1) * itemsPerPage + 1; // Calculate start index for display
    const currentEndIndex = Math.min(startIndex + itemsPerPage -1, filteredCustomerData.length); // Calculate end index for display
    paginationInfo.textContent = `Showing ${startIndex} to ${currentEndIndex} of ${filteredCustomerData.length} customers`; // Update pagination text
    prevPageBtn.disabled = currentPage === 1; // Disable previous button if on first page
    nextPageBtn.disabled = currentPage === totalPages; // Disable next button if on last page
    pageNumbersContainer.innerHTML = ''; // Clear old page numbers
    for (let i = 1; i <= totalPages; i++) { // Loop to create page number buttons
        const pageButton = document.createElement('button'); // Create a new button
        pageButton.classList.add('pagination-button'); // Add pagination button class
        if (i === currentPage) { // If it's the current page
            pageButton.classList.add('active-page'); // Add active page class
        }
        pageButton.textContent = i; // Set button text to page number
        pageButton.addEventListener('click', () => { // Add click listener to page button
            currentPage = i; // Set current page
            renderTable(); // Re-render table
        });
        pageNumbersContainer.appendChild(pageButton); // Append button to container
    }
}
// Event Listeners for Pagination Buttons
prevPageBtn.addEventListener('click', () => { // Event listener for previous page button
    if (currentPage > 1) { // If not on the first page
        currentPage--; // Decrement page number
        renderTable(); // Re-render table
    }
});
nextPageBtn.addEventListener('click', () => { // Event listener for next page button
    if (currentPage < totalPages) { // If not on the last page
        currentPage++; // Increment page number
        renderTable(); // Re-render table
    }
});
// --- ARR Filter Capsule Event Listeners ---
function updateArrCapsuleVisuals() { // Updates the visual state of ARR filter capsule
    if (arrLessThan5kActive) { // If < $5K filter is active
        arrLessThan5kSpan.classList.add('active'); // Add 'active' class
    } else {
        arrLessThan5kSpan.classList.remove('active'); // Remove 'active' class
    }
    if (arrGreaterThan5kActive) { // If > $5K filter is active
        arrGreaterThan5kSpan.classList.add('active'); // Add 'active' class
    } else {
        arrGreaterThan5kSpan.classList.remove('active'); // Remove 'active' class
    }
    if (arrLessThan5kActive || arrGreaterThan5kActive) { // Determine if the overall capsule should look 'active'
        filterArrCapsule.classList.add('active'); // Add 'active' class to capsule
    } else {
        filterArrCapsule.classList.remove('active'); // Remove 'active' class from capsule
    }
}
arrLessThan5kSpan.addEventListener('click', () => { // Event listener for < $5K filter span
    arrLessThan5kActive = !arrLessThan5kActive; // Toggle its own state
    if (arrLessThan5kActive) { // If it becomes active, deactivate the other
        arrGreaterThan5kActive = false; // Deactivate > $5K filter
    }
    applyAllFilters(); // Apply all filters
});
arrGreaterThan5kSpan.addEventListener('click', () => { // Event listener for > $5K filter span
    arrGreaterThan5kActive = !arrGreaterThan5kActive; // Toggle its own state
    if (arrGreaterThan5kActive) { // If it becomes active, deactivate the other
        arrLessThan5kActive = false; // Deactivate < $5K filter
    }
    applyAllFilters(); // Apply all filters
});
// --- Filter Modal Functions ---
// Function to create a new filter row
function createFilterRow() { // Creates a new filter row for the modal
    const filterRowDiv = document.createElement('div'); // Create div for filter row
    filterRowDiv.classList.add('filter-row'); // Add 'filter-row' class
    filterRowDiv.innerHTML = `
        <select class="filter-field-select">
            <option value="name">CUSTOMER</option>
            <option value="industry">INDUSTRY</option>
            <option value="industrySector">INDUSTRY SECTOR</option>
            <option value="arr">ARR</option>
            <option value="products">PRODUCTS</option>
            <option value="healthScore">HEALTH SCORE</option>
            <option value="status">STATUS</option>
            <option value="lastInteraction">LAST INTERACTION</option>
        </select>
        <select class="filter-operator-select">
            <option value="contains">contains</option>
            <option value="equals">equals</option>
            <option value="starts_with">starts with</option>
            <option value="ends_with">ends with</option>
        </select>
        <input type="text" class="filter-value-input" placeholder="Enter value">
        <button class="delete-filter-btn" type="button">&#x1F5D1;</button> <!-- Trash icon -->
    `; // Populate filter row HTML
    const fieldSelect = filterRowDiv.querySelector('.filter-field-select'); // Get field select element
    const operatorSelect = filterRowDiv.querySelector('.filter-operator-select'); // Get operator select element
    fieldSelect.addEventListener('change', () => { // Adjust operators based on selected field
        const selectedField = fieldSelect.value; // Get selected field
        operatorSelect.innerHTML = ''; // Clear existing options
        if (selectedField === 'arr' || selectedField === 'healthScore') { // If field is numeric
            operatorSelect.innerHTML = `
                <option value="equals">equals</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
            `; // Add numeric operators
            filterRowDiv.querySelector('.filter-value-input').type = 'number'; // Change input type for numbers
        } else { // If field is text
            operatorSelect.innerHTML = `
                <option value="contains">contains</option>
                <option value="equals">equals</option>
                <option value="starts_with">starts with</option>
                <option value="ends_with">ends with</option>
            `; // Add text operators
            filterRowDiv.querySelector('.filter-value-input').type = 'text'; // Change input type back
        }
    });
    const deleteButton = filterRowDiv.querySelector('.delete-filter-btn'); // Get delete button
    deleteButton.addEventListener('click', () => { // Add event listener to the delete button
        filterRowDiv.remove(); // Remove the filter row
    });
    return filterRowDiv; // Return the created filter row
}
// --- Event Listeners for Filter Modal ---
// Open the filter modal when "Filter" button is clicked
openFilterModalBtn.addEventListener('click', () => { // Open filter modal on button click
    filterModal.classList.add('show-flex'); // Use class to show and center the modal
    filterModalBody.innerHTML = '<p style="font-size: 0.9em; color: #616161; margin-top: 0;">Add one or more conditions to filter the customer table.</p>'; // Clear and add initial text
    filterModalBody.appendChild(createFilterRow()); // Add the first filter row
});
// Close the filter modal when "x" is clicked
closeFilterModalBtn.addEventListener('click', () => { // Close filter modal on 'x' click
    filterModal.classList.remove('show-flex'); // Use class to hide the modal
});
// Close the filter modal when clicking outside of it
window.addEventListener('click', (event) => { // Close filter modal when clicking outside
    if (event.target == filterModal) { // If click target is the modal overlay
        filterModal.classList.remove('show-flex'); // Use class to hide the modal
    }
});
// Add another filter row
addFilterRowBtn.addEventListener('click', () => { // Add another filter row on button click
    filterModalBody.appendChild(createFilterRow()); // Append new filter row
});
// Clear All Filters functionality
clearAllFiltersBtn.addEventListener('click', () => { // Clear all filters on button click
    arrLessThan5kActive = false; // Reset both ARR flags
    arrGreaterThan5kActive = false; // Reset both ARR flags
    applyAllFilters(); // Re-apply all filters (which will now just show original data)
    filterModalBody.innerHTML = '<p style="font-size: 0.9em; color: #616161; margin-top: 0;">Add one or more conditions to filter the customer table.</p>'; // Clear all filter rows
    filterModalBody.appendChild(createFilterRow()); // Add one default filter row back
    filterModal.classList.remove('show-flex'); // Close the modal after clearing
});
// Apply Filters functionality
applyFiltersBtn.addEventListener('click', () => { // Apply filters on button click
    applyAllFilters(); // Apply all filters
    filterModal.classList.remove('show-flex'); // Close the modal
});
// --- Sort Modal Functions and Event Listeners ---
// Open the sort modal

 function updateSortIconVisuals() {
    document.querySelectorAll('.merchant-table th .sort-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    const activeIcon = document.querySelector(`.merchant-table th[data-column="${currentSortColumn}"] .sort-icon.${currentSortDirection}`);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
}
document.querySelectorAll('.merchant-table th').forEach(header => {
    const column = header.dataset.column;
    if (column) { // Only add listeners to sortable columns
        header.querySelectorAll('.sort-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const newDirection = event.target.dataset.direction;
 
                if (currentSortColumn === column && currentSortDirection === newDirection) {
                    // If clicking the active sort icon again, deselect it (optional, but good UX)
                    currentSortColumn = 'name'; // Reset to default column
                    currentSortDirection = 'asc'; // Reset to default direction
                } else {
                    currentSortColumn = column;
                    currentSortDirection = newDirection;
                }
                applyAllFilters();
            });
        });
    }
});
// Close the sort modal
closeSortModalBtn.addEventListener('click', () => { // Close sort modal on 'x' click
    sortModal.classList.remove('show-flex'); // Hide sort modal
});
// Close sort modal when clicking outside
window.addEventListener('click', (event) => { // Close sort modal when clicking outside
    if (event.target == sortModal) { // If click target is the modal overlay
        sortModal.classList.remove('show-flex'); // Hide sort modal
    }
});
// Handle sort direction button clicks
sortAscendingBtn.addEventListener('click', () => { // Event listener for ascending sort button
    sortAscendingBtn.classList.add('active'); // Activate ascending button
    sortDescendingBtn.classList.remove('active'); // Deactivate descending button
    currentSortDirection = 'asc'; // Set current sort direction to ascending
});
sortDescendingBtn.addEventListener('click', () => { // Event listener for descending sort button
    sortDescendingBtn.classList.add('active'); // Activate descending button
    sortAscendingBtn.classList.remove('active'); // Deactivate ascending button
    currentSortDirection = 'desc'; // Set current sort direction to descending
});
// Clear Sort functionality
clearSortBtn.addEventListener('click', () => { // Clear sort on button click
    currentSortColumn = 'name'; // Reset to default column
    currentSortDirection = 'asc'; // Reset to default direction
    applyAllFilters(); // Re-apply all filters, effectively clearing sort
    sortModal.classList.remove('show-flex'); // Close sort modal
});
// Apply Sort functionality
applySortBtn.addEventListener('click', () => { // Apply sort on button click
    const column = sortColumnSelect.value; // Get selected sort column
    const direction = currentSortDirection; // Get current sort direction
    currentSortColumn = column; // Store applied sort settings
    applyAllFilters(); // Apply sort along with existing filters
    sortModal.classList.remove('show-flex'); // Close sort modal
});
// Event listener for the new global Upsell & Cross-sell filter
upsellCrossSellFilter.addEventListener('change', (event) => {
    updateUpsellCrossSellCard(event.target.value);
});
// --- Chart Data and Logic for ARR Trend (Combined Year) ---
let arrTrendChart; // Main ARR Trend Chartf
const arrTrendCanvas = document.getElementById('arrTrendChart');
const arrTrendCtx = arrTrendCanvas.getContext('2d');
// Data for ARR Trend Comparison (Current Year vs. Previous Year)
const arrTrendData = {
    "current": {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        currentYear: [25, 28, 31, 35, 42, 50, 52, 55, 58, 62, 65, 70],
        previousYear: [20, 23, 26, 29, 33, 38, 40, 45, 48, 50, 55, 60]
    },
    // Example for 6 months (add more periods as needed)
    "6months": {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        currentYear: [31, 35, 42, 50, 52, 55],
        previousYear: [26, 29, 33, 38, 40, 45]
    },
    "12months": {
        labels: ['Aug\'24', 'Sep\'24', 'Oct\'24', 'Nov\'24', 'Dec\'24', 'Jan\'25', 'Feb\'25', 'Mar\'25', 'Apr\'25', 'May\'25', 'Jun\'25', 'Jul\'25'],
        currentYear: [45, 48, 50, 55, 60, 25, 28, 31, 35, 42, 50, 52], // Illustrative data for past 12 months
        previousYear: [40, 42, 45, 48, 50, 20, 23, 26, 29, 33, 38, 40]
    },
    "ytd": {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        currentYear: [25, 28, 31, 35, 42, 50, 52, 55],
        previousYear: [20, 23, 26, 29, 33, 38, 40, 45]
    }
};
// Function to render the ARR Trend Chart
function renderArrTrendChart(period = 'current') {
    if (arrTrendChart) {
        arrTrendChart.destroy();
    }
    const data = arrTrendData[period];
    if (!data) return; // Handle invalid period
    arrTrendChart = new Chart(arrTrendCtx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Current Year ARR ($M)',
                    data: data.currentYear,
                    borderColor: '#007bff', // Blue
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#007bff'
                },
                {
                    label: 'Previous Year ARR ($M)',
                    data: data.previousYear,
                    borderColor: '#6c757d', // Gray
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#6c757d'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y}M`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ARR ($M)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `$${value}M`;
                        }
                    }
                }
            }
        }
    });
}
// ARR Trend Filter Dropdown
document.getElementById('arrTrendFilter').addEventListener('change', (event) => {
    renderArrTrendChart(event.target.value);
});
// --- Chart Data and Logic for Combination Chart (GMV & Conversion Rate) ---
let gmvConversionChart;
const gmvConversionChartCanvas = document.getElementById('gmvConversionChartCanvas');
const gmvConversionCtx = gmvConversionChartCanvas.getContext('2d');
const gmvConversionData = {
    labels: ['E-commerce', 'Education', 'Healthcare', 'Others', 'SaaS', 'Retail', 'Food & Beverage'],
    gmv: [150000, 90000, 48000, 28000, 180000, 80000, 60000], // in $
    conversionRate: [5.2, 3.5, 2.8, 1.4, 5.8, 4.1, 3.0] // in %
};
function renderGmvConversionChart() {
    if (gmvConversionChart) {
        gmvConversionChart.destroy();
    }
    gmvConversionChart = new Chart(gmvConversionCtx, {
        type: 'bar',
        data: {
            labels: gmvConversionData.labels,
            datasets: [
                {
                    label: 'GMV ($)',
                    data: gmvConversionData.gmv,
                    backgroundColor: ['#5a9eff', '#007bff', '#5a9eff', '#007bff', '#5a9eff', '#007bff', '#5a9eff'], // Example colors
                    // Using a gradient for bars might look better but requires more complex setup for each bar
                    borderRadius: 5,
                    yAxisID: 'y'
                },
                {
                    label: 'Conversion Rate (%)',
                    data: gmvConversionData.conversionRate,
                    type: 'line',
                    borderColor: '#6f42c1', // Purple
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#6f42c1',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 10,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                if (context.dataset.label === 'GMV ($)') {
                                    label += `: $${context.parsed.y.toLocaleString()}`;
                                } else {
                                    label += `: ${context.parsed.y}%`;
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: { // Left Y-axis for GMV
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'GMV ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `$${value.toLocaleString()}`;
                        }
                    }
                },
                y1: { // Right Y-axis for Conversion Rate
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Conversion Rate (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `${value}%`;
                        }
                    },
                    grid: {
                        drawOnChartArea: false // Only draw grid lines for the left Y-axis
                    }
                }
            }
        }
    });
}




const crossSellOpportunitiesData = [
    {
        title: 'Zoho Desk for Support Teams',
        description: 'Introduce Zoho Desk to 18 clients who currently lack an integrated support system.',
        clients: 18,
        totalClients: 50,
        revenue: 120000
    },
    {
        title: 'Zoho Books for Accounting',
        description: 'Cross-sell Zoho Books to 12 clients using other accounting software.',
        clients: 12,
        totalClients: 50,
        revenue: 70000
    },
    {
        title: 'Zoho Campaigns Integration',
        description: 'Recommend Zoho Campaigns to 15 clients to enhance their marketing automation efforts.',
        clients: 15,
        totalClients: 50,
        revenue: 90000
    }
];
const churnFilter = document.getElementById('churnFilter');
const churnRateElem = document.getElementById('churnRate');
const churnedAccountsElem = document.getElementById('churnedAccounts');
const revenueLostElem = document.getElementById('revenueLost');
const churnReasonsListElem = document.getElementById('churnReasonsList');
const analyzeChurnBtn = document.getElementById('analyzeChurnBtn');

const churnAnalysisModal = document.getElementById('churnAnalysisModal');
const closeChurnAnalysisModalBtn = document.getElementById('closeChurnAnalysisModalBtn');
const closeChurnAnalysisModalFooterBtn = document.getElementById('closeChurnAnalysisModalFooterBtn');
const modalChurnedAccounts = document.getElementById('modalChurnedAccounts');
const modalRevenueLost = document.getElementById('modalRevenueLost');
const modalAverageAcv = document.getElementById('modalAverageAcv');


const growthOpportunityFilter = document.getElementById('growthOpportunityFilter');
const opportunitiesGrid = document.getElementById('opportunitiesGrid');
const growthOpportunitiesBadge = document.getElementById('growthOpportunitiesBadge');


// --- Churn Insights Card Logic ---
const churnData = {
"mtd": { // Month to Date
churnRate: "3.5%",
churnedAccounts: 5,
revenueLost: 180000,
highestChurnPeriod: "This Month", // Key data point
highestChurnPercentage: "3.5%", // Associated data point
reasons: [
"Low Zoho product adoption (CRM, Books)",
"Lack of proactive support engagement",
"Competitive pricing/features"
],
detailedReasons: [
{ label: "Accounts by Industry", value: "3 Retail, 2 SMB" },
{ label: "Product Usage Factor", value: "70% minimal CRM/SalesIQ" },
{ label: "Support Interaction Gap", value: "Average 60 days no touch" },
{ label: "Competitor Mentioned", value: "2 accounts mentioned 'X' competitor" }
],
averageAcv: 36000
},
"qtr": { // Quarter to Date
churnRate: "8.2%",
churnedAccounts: 18,
revenueLost: 650000,
highestChurnPeriod: "April (Q2)", // Key data point
highestChurnPercentage: "3.0%", // Associated data point
reasons: [
"Product usability issues (Desk, Analytics)",
"Pricing pressure from competitors",
"Lack of feature parity (Sites, Campaigns)"
],
detailedReasons: [
{ label: "Accounts by Industry", value: "8 SaaS, 5 E-commerce, 5 Other" },
{ label: "Product Usage Factor", value: "85% limited Desk/Analytics use" },
{ label: "Pricing Feedback", value: "10 accounts cited pricing as main reason" },
{ label: "Feature Requests Unmet", value: "6 accounts needed specific integration" }
],
averageAcv: 36111
},
"ytd": { // Year to Date
churnRate: "15.1%",
churnedAccounts: 32,
revenueLost: 1200000,
highestChurnPeriod: "Q1 2024 (March)", // Key data point
highestChurnPercentage: "4.5%", // Associated data point
reasons: [
"Lack of deep integration with existing tools",
"Customer success team engagement gaps",
"Business model changes at client side"
],
detailedReasons: [
{ label: "Accounts by Industry", value: "12 Enterprise, 10 SMB, 10 Other" },
{ label: "Product Usage Factor", value: "90% low cross-product integration" },
{ label: "CSM Engagement Score", value: "Average 2.5/5 for churned accounts" },
{ label: "Migration to New Platform", value: "8 accounts moved to alternative solutions" }
],
averageAcv: 37500
}
};
 
// ... (other code) ...
 
// Element for the Highest Churn Period in the modal
const modalHighestChurnPeriod = document.getElementById('modalHighestChurnPeriod');
 
// Function to populate the churn analysis modal with data based on the selected period
function populateChurnAnalysisModal(period) {
            const data = churnData[period];
            if (!data) return;

            modalChurnedAccounts.textContent = data.churnedAccounts;
            modalRevenueLost.textContent = formatArr(data.revenueLost);
            modalAverageAcv.textContent = formatArr(data.averageAcv);
            modalHighestChurnPeriod.textContent = `${data.highestChurnPeriod} (${data.highestChurnPercentage})`; // Populate new element
        }
 
// Event listener for when the "Analyze Churned Accounts" button is clicked
analyzeChurnBtn.addEventListener('click', () => {
const currentPeriod = churnFilter.value; // Get the currently selected filter value (mtd, qtr, ytd)
populateChurnAnalysisModal(currentPeriod); // Call the function to populate the modal
churnAnalysisModal.classList.add('show-flex'); // Show the modal
});

function updateChurnCard(period) {
    const data = churnData[period];
    if (!data) return;

    churnRateElem.textContent = data.churnRate;
    churnedAccountsElem.textContent = data.churnedAccounts;
    revenueLostElem.textContent = formatArr(data.revenueLost);

    churnReasonsListElem.innerHTML = '';
    data.reasons.forEach(reason => {
        const li = document.createElement('li');
        li.textContent = reason;
        churnReasonsListElem.appendChild(li);
    });
}

function populateChurnAnalysisModal(period) {
    const data = churnData[period];
    if (!data) return;
        modalChurnedAccounts.textContent = data.churnedAccounts;
        modalRevenueLost.textContent = formatArr(data.revenueLost);
        modalAverageAcv.textContent = formatArr(data.averageAcv);
        modalHighestChurnPeriod.textContent = `${data.highestChurnPeriod} (${data.highestChurnPercentage})`; // Populate new element
}

churnFilter.addEventListener('change', (event) => {
    updateChurnCard(event.target.value);
});

analyzeChurnBtn.addEventListener('click', () => {
    const currentPeriod = churnFilter.value;
    populateChurnAnalysisModal(currentPeriod);
    churnAnalysisModal.classList.add('show-flex');
});

closeChurnAnalysisModalBtn.addEventListener('click', () => {
    churnAnalysisModal.classList.remove('show-flex');
});

closeChurnAnalysisModalFooterBtn.addEventListener('click', () => {
    churnAnalysisModal.classList.remove('show-flex');
});

window.addEventListener('click', (event) => {
    if (event.target == churnAnalysisModal) {
        churnAnalysisModal.classList.remove('show-flex');
    }
});

growthOpportunityFilter.addEventListener('change', (event) => {
    updateGrowthOpportunitiesCard(event.target.value);
});


// --- Initial Render on Load ---
window.addEventListener('load', () => { // Initial render when window loads
    switchTab('dashboard'); // Ensure the dashboard tab is active and visible by default
    applyAllFilters(); // Initial render of the table with all filters applied (if any)
    updateUpsellCrossSellCard(upsellCrossSellFilter.value); // Initial render for Upsell/Cross-sell card
    renderProductAdoption(); // Initial render for Product Adoption card
    renderArrTrendChart(); // Initial render for ARR Trend Chart
    renderGmvConversionChart(); // Initial render for Combination Chart
    updateChurnCard(churnFilter.value); // Initial render for Churn Insights card
    updateGrowthOpportunitiesCard(growthOpportunityFilter.value); // Initial render for Growth Opportunities
});
window.addEventListener('resize', () => { // Event listener for window resize
    // Re-render upsell/cross-sell charts on resize
    if (dashboardContent.style.display !== 'none') {
        updateUpsellCrossSellCard(upsellCrossSellFilter.value);
        renderArrTrendChart(document.getElementById('arrTrendFilter').value); // Re-render with current filter
        renderGmvConversionChart(); // Re-render Combination Chart
    }
});

// --- Growth Opportunities Card Logic ---
const upsellOpportunitiesData = [
    {
        title: 'CRM Advanced Feature Upsell',
        description: 'Offer advanced CRM features like SalesIQ and workflow automation to 20 clients.',
        clients: 20,
        totalClients: 50,
        revenue: 150000
    },
    {
        title: 'Zoho One Suite Upgrade',
        description: 'Propose Zoho One to 10 clients currently using 3+ individual Zoho apps.',
        clients: 10,
        totalClients: 50,
        revenue: 250000
    },
    {
        title: 'Analytics Premium Plan',
        description: 'Target 15 clients for an upgrade to Zoho Analytics Premium features.',
        clients: 15,
        totalClients: 50,
        revenue: 80000
    }
];
function updateGrowthOpportunitiesCard(type) {
    let dataToShow = [];
    let totalCount = 0;

    if (type === 'upsell') {
        dataToShow = upsellOpportunitiesData;
        totalCount = upsellOpportunitiesData.length;
    } else if (type === 'cross-sell') {
        dataToShow = crossSellOpportunitiesData;
        totalCount = crossSellOpportunitiesData.length;
    }

    opportunitiesGrid.innerHTML = '';
    dataToShow.forEach(opportunity => {
        const completionPercentage = (opportunity.clients / opportunity.totalClients) * 100;
        const opportunityCard = document.createElement('div');
        opportunityCard.classList.add('opportunity-card');
        opportunityCard.innerHTML = `
            <div class="opportunity-content">
                <div class="opportunity-title">${opportunity.title}</div>
                <div class="opportunity-description">${opportunity.description}</div>
                <div class="opportunity-progress-bar-container">
                    <div class="opportunity-progress-bar-fill" style="width: ${completionPercentage.toFixed(0)}%;"></div>
                </div>
                <div class="opportunity-stats">
                    <span>${opportunity.clients}/${opportunity.totalClients} clients</span>
                    <span class="value">${formatArr(opportunity.revenue)} opportunity</span>
                </div>
            </div>
        `;
        opportunitiesGrid.appendChild(opportunityCard);
    });

    growthOpportunitiesBadge.textContent = `${totalCount} identified`;
}
function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

function handleRefresh(event) {
    const btn = event.currentTarget;

    // Spin animation
    btn.classList.add('spinning');

    // Ripple effect
    createRipple(btn);

    // Simulate content refresh
    setTimeout(() => {
        const dashboard = document.getElementById('dashboard-content');
        if(dashboard) {
            // Simple way: force re-render by toggling visibility
            dashboard.style.display = 'none';
            setTimeout(() => dashboard.style.display = 'block', 50);
        }

        // Stop spinning
        btn.classList.remove('spinning');
    }, 1000); // Simulate 1 second "refresh"
}

            const scoreElement = document.querySelector('.score-circle');
            const healthStatusLabel = document.getElementById('healthStatusLabel');
            const infoIcon = document.getElementById('infoIcon');
            const criteriaPopup = document.getElementById('criteriaPopup');

            // Function to update the health status label based on the score
            function updateHealthStatus(score) {
                healthStatusLabel.classList.remove('excellent', 'good', 'average', 'poor');
                let statusText = '';
                if (score >= 90) {
                    statusText = 'Excellent';
                    healthStatusLabel.classList.add('excellent');
                } else if (score >= 70 && score <= 89) {
                    statusText = 'Good';
                    healthStatusLabel.classList.add('good');
                } else if (score >= 41 && score <= 69) {
                    statusText = 'Average';
                    healthStatusLabel.classList.add('average');
                } else if (score < 40) {
                    statusText = 'Poor';
                    healthStatusLabel.classList.add('poor');
                }
                healthStatusLabel.textContent = statusText;
            }

            // Get the current score from the circle and update the label
            const currentScore = parseInt(scoreElement.textContent);
            if (!isNaN(currentScore)) {
                updateHealthStatus(currentScore);
            }

            // Toggle popup visibility on info icon click
            infoIcon.addEventListener('click', (event) => {
                criteriaPopup.classList.toggle('hidden');
                criteriaPopup.classList.toggle('show');
                event.stopPropagation(); // Prevent document click from closing it immediately
            });

            // Close popup when clicking anywhere outside it
            document.addEventListener('click', (event) => {
                if (!criteriaPopup.classList.contains('hidden') && !infoIcon.contains(event.target) && !criteriaPopup.contains(event.target)) {
                    criteriaPopup.classList.add('hidden');
                    criteriaPopup.classList.remove('show');
                }
            });