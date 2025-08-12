console.log("script.js loaded!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded!");

    // --- Dropdown Logic for User Profile, Timeframe, MTD ---
    const initializeDropdown = (buttonId, dropdownId) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);
        if (!button || !dropdown) {
            console.error(`Button or dropdown not found for IDs: ${buttonId}, ${dropdownId}`);
            return;
        }
        const options = dropdown.querySelectorAll('div[data-value]');

        const displayTargetElement = (buttonId === 'userProfileButton') ?
                                     document.getElementById('userDisplayName') :
                                     button.childNodes[0];

        let currentSelectedValue = Array.from(options).find(option => option.classList.contains('checked-option'))?.dataset.value || options[0]?.dataset.value;
        if (currentSelectedValue) {
            updateDisplay(currentSelectedValue);
        }

        function updateDisplay(selectedValue) {
            options.forEach(option => {
                if (option.dataset.value === selectedValue) {
                    option.classList.add('checked-option');
                    if (displayTargetElement && displayTargetElement.nodeType === Node.TEXT_NODE) {
                        displayTargetElement.nodeValue = option.textContent.trim();
                    } else if (displayTargetElement) {
                        displayTargetElement.textContent = option.textContent.trim();
                    }
                } else {
                    option.classList.remove('checked-option');
                }
            });
            currentSelectedValue = selectedValue;
        }

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            d3.selectAll('.dropdown-menu').each(function() {
                if (this.id !== dropdownId) {
                    d3.select(this).classed('hidden', true);
                    d3.select(this.previousElementSibling).attr('aria-expanded', 'false');
                }
            });

            dropdown.classList.toggle('hidden');
            const isExpanded = dropdown.classList.contains('hidden') ? 'false' : 'true';
            button.setAttribute('aria-expanded', isExpanded);
        });

        dropdown.addEventListener('click', (event) => {
            const selectedOption = event.target.closest('div[data-value]');
            if (selectedOption) {
                const value = selectedOption.dataset.value;
                if (value !== currentSelectedValue) {
                    console.log(`${buttonId} selected: ${value}`);
                    updateDisplay(value);
                    if (buttonId === 'timeframeButton') {
                        renderArrTrendChart();
                    } else if (buttonId === 'mtdButton') {
                        renderGmvByIndustryChart();
                    }
                }
                dropdown.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    };

    // Initialize all dropdowns
    initializeDropdown('segmentsButton', 'segmentsDropdown');
    initializeDropdown('industriesButton', 'industriesDropdown');
    initializeDropdown('healthScoresButton', 'healthScoresDropdown');
    initializeDropdown('userProfileButton', 'userProfileDropdown');
    initializeDropdown('timeframeButton', 'timeframeDropdown');
    initializeDropdown('mtdButton', 'mtdDropdown');

    // --- Tab Switching Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));
            item.classList.add('active');
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                if (targetId === 'accountManagerDashboardContent') {
                    renderArrTrendChart();
                    renderGmvByIndustryChart();
                    renderMerchantTable();
                }
            }
        });
    });

    // --- Global Click Listener to Close All Dropdowns & Modals ---
    document.addEventListener('click', (event) => {
        // Close all dropdown menus
        d3.selectAll('.dropdown-menu').each(function() {
            const dropdown = d3.select(this);
            const button = d3.select(this.previousElementSibling);
            if (button.node() && !button.node().contains(event.target) && !dropdown.node().contains(event.target)) {
                dropdown.classed('hidden', true);
                button.attr('aria-expanded', 'false');
            }
        });

        // Close the filter modal if clicked outside
        const filterModal = document.getElementById('filterModal');
        const filterButton = document.getElementById('filterButton');
        if (!filterModal.contains(event.target) && event.target !== filterButton && !filterButton.contains(event.target)) {
            filterModal.classList.add('hidden');
        }

        // Close the sort modal if clicked outside
        const sortModal = document.getElementById('sortModal');
        const sortButton = document.getElementById('sortButton');
        if (!sortModal.contains(event.target) && event.target !== sortButton && !sortButton.contains(event.target)) {
            sortModal.classList.add('hidden');
        }
    });

    // --- D3.js ARR Trend Chart ---
    let arrVisible = true;
    let targetVisible = false;
    let arrLinePath, arrAreaPath, arrCircles;
    let targetLinePath, targetCircles;

    const toggleGraphVisibility = () => {
        if (arrLinePath) arrLinePath.style("display", arrVisible ? null : "none");
        if (arrAreaPath) arrAreaPath.style("display", arrVisible ? null : "none");
        if (arrCircles) arrCircles.style("display", arrVisible ? null : "none");
        if (targetLinePath) targetLinePath.style("display", targetVisible ? null : "none");
        if (targetCircles) targetCircles.style("display", targetVisible ? null : "none");
    };

    const renderArrTrendChart = () => {
        d3.select("#arr-trend-chart svg").remove();
        const data = [
            { month: "Jan", arr: 28, target: 30 },
            { month: "Feb", arr: 32, target: 38 },
            { month: "Mar", arr: 35, target: 46 },
            { month: "Apr", arr: 38, target: 54 },
            { month: "May", arr: 43, target: 62 },
            { month: "Jun", arr: 0, target: 70 }
        ];
        const containerElement = document.getElementById('arr-trend-chart');
        if (!containerElement) {
            return;
        }
        const containerWidth = containerElement.clientWidth;
        const margin = { top: 30, right: 40, bottom: 50, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        if (width <= 0 || height <= 0) {
            console.warn("ARR Trend Chart dimensions are zero or negative, skipping render. Width:", width, "Height:", height);
            return;
        }

        const svg = d3.select("#arr-trend-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([0, width])
            .padding(1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.arr, d.target, 70))])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickSizeOuter(0))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#6B7280");

        svg.append("g")
            .call(d3.axisLeft(yScale)
                .tickValues(d3.range(0, Math.ceil(yScale.domain()[1] / 10) * 10 + 1, 5))
                .tickFormat(d => `$${d}M`))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#6B7280");

        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat(""))
            .selectAll("line")
            .attr("stroke", "#e5e7eb")
            .attr("stroke-dasharray", "2,2");

        const arrLine = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.arr))
            .curve(d3.curveMonotoneX);

        const targetLine = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.target))
            .curve(d3.curveMonotoneX);

        const arrArea = d3.area()
            .x(d => xScale(d.month))
            .y0(yScale(0))
            .y1(d => yScale(d.arr))
            .curve(d3.curveMonotoneX);

        arrAreaPath = svg.append("path")
            .datum(data)
            .attr("fill", "rgba(59, 130, 246, 0.2)")
            .attr("d", arrArea);

        arrLinePath = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#2563eb")
            .attr("stroke-width", 2)
            .attr("d", arrLine);

        targetLinePath = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#9ca3af")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("d", targetLine);

        arrCircles = svg.selectAll(".dot-arr")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-arr")
            .attr("cx", d => xScale(d.month))
            .attr("cy", d => yScale(d.arr))
            .attr("r", 5)
            .attr("fill", "#2563eb")
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        targetCircles = svg.selectAll(".dot-target")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-target")
            .attr("cx", d => xScale(d.month))
            .attr("cy", d => yScale(d.target))
            .attr("r", 5)
            .attr("fill", "#9ca3af")
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        toggleGraphVisibility();
        window.removeEventListener('resize', renderArrTrendChart);
        window.addEventListener('resize', renderArrTrendChart);
    };

    const arrLegendItem = document.getElementById('arrLegendItem');
    const targetLegendItem = document.getElementById('targetLegendItem');

    if (arrLegendItem) {
        arrLegendItem.addEventListener('click', () => {
            arrVisible = !arrVisible;
            toggleGraphVisibility();
        });
    } else {
        console.error("ARR legend item not found!");
    }

    if (targetLegendItem) {
        targetLegendItem.addEventListener('click', () => {
            targetVisible = !targetVisible;
            toggleGraphVisibility();
        });
    } else {
        console.error("Target legend item not found!");
    }


    // --- D3.js GMV by Industry Donut Chart ---
    const renderGmvByIndustryChart = () => {
        d3.select("#gmv-by-industry-chart svg").remove();
        const data = [
            { industry: "E-commerce", value: 35 },
            { industry: "SaaS", value: 25 },
            { industry: "Education", value: 15 },
            { industry: "Retail", value: 10 },
            { industry: "Healthcare", value: 7 },
            { industry: "Food & Beverage", value: 5 },
            { industry: "Others", value: 3 }
        ];

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.industry))
            .range(["#6366f1", "#8b5cf6", "#34d399", "#fbbf24", "#ef4444", "#6b7280", "#d1d5db"]);

        const containerElement = document.getElementById('gmv-by-industry-chart');
        if (!containerElement) {
            return;
        }
        const containerSize = Math.min(containerElement.clientWidth, containerElement.clientHeight);
        const radius = Math.min(containerSize / 2, 150);
        const innerRadius = radius * 0.6;
        if (radius <= 0) {
            console.warn("GMV by Industry Chart radius is zero or negative, skipping render.");
            return;
        }

        const svg = d3.select("#gmv-by-industry-chart")
            .append("svg")
            .attr("width", radius * 2)
            .attr("height", radius * 2)
            .append("g")
            .attr("transform", `translate(${radius},${radius})`);

        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.industry))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        window.removeEventListener('resize', renderGmvByIndustryChart);
        window.addEventListener('resize', renderGmvByIndustryChart);
    };

    // --- Dynamic Table Logic ---

    const merchants = [
        { id: 'TECH78901234', name: 'TechMart Solutions', initial: 'TM', initialBg: 'bg-blue-100', initialText: 'text-blue-800', industry: 'E-commerce', gmv: 1.24, gmvChange: 12.4, products: ['PG', 'Neo', 'Engage'], healthScore: 87, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: 'Today', lastInteractionType: 'QBR Meeting' },
        { id: 'GLOB45678901', name: 'Global SaaS Inc.', initial: 'GS', initialBg: 'bg-purple-100', initialText: 'text-purple-800', industry: 'SaaS', gmv: 3.82, gmvChange: 8.7, products: ['PG', 'Neo'], healthScore: 76, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: 'Yesterday', lastInteractionType: 'Email' },
        { id: 'EDUR12345678', name: 'EduRight Academy', initial: 'ER', initialBg: 'bg-green-100', initialText: 'text-green-800', industry: 'Education', gmv: 0.94, gmvChange: 24.2, products: ['PG', 'Neo', 'POS'], healthScore: 92, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: '3 days ago', lastInteractionType: 'Product Demo' },
        { id: 'FASH456789012', name: 'Fashion Retail Co.', initial: 'FR', initialBg: 'bg-red-100', initialText: 'text-red-800', industry: 'Retail', gmv: 2.18, gmvChange: -3.5, products: ['PG', 'POS', 'Engage'], healthScore: 68, status: 'At Risk', statusBg: 'bg-yellow-100', statusText: 'text-yellow-800', lastInteractionDate: '1 week ago', lastInteractionType: 'Support Call' },
        { id: 'HEAL46789012', name: 'HealthTech Solutions', initial: 'HT', initialBg: 'bg-orange-100', initialText: 'text-orange-800', industry: 'Healthcare', gmv: 1.76, gmvChange: 5.2, products: ['PG', 'Neo'], healthScore: 72, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: '2 days ago', lastInteractionType: 'WhatsApp' },
        { id: 'FOOD78901234', name: 'Food Delivery Pro', initial: 'FD', initialBg: 'bg-gray-100', initialText: 'text-gray-800', industry: 'Food & Beverage', gmv: 0.82, gmvChange: -1.8, products: ['PG'], healthScore: 34, status: 'Inactive', statusBg: 'bg-red-100', statusText: 'text-red-800', lastInteractionDate: '3 weeks ago', lastInteractionType: 'Email' },
        { id: 'AUTO55566677', name: 'Auto Parts Supply', initial: 'AS', initialBg: 'bg-blue-100', initialText: 'text-blue-800', industry: 'Automotive', gmv: 0.51, gmvChange: 7.1, products: ['PG'], healthScore: 65, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: '4 days ago', lastInteractionType: 'Follow-up Call' },
        { id: 'TRVL88899900', name: 'Travel Ventures', initial: 'TV', initialBg: 'bg-pink-100', initialText: 'text-pink-800', industry: 'Travel', gmv: 1.95, gmvChange: -10.5, products: ['PG', 'Neo'], healthScore: 55, status: 'At Risk', statusBg: 'bg-yellow-100', statusText: 'text-yellow-800', lastInteractionDate: '1 month ago', lastInteractionType: 'Support Ticket' },
        { id: 'REAL11122233', name: 'Real Estate Pros', initial: 'RP', initialBg: 'bg-orange-100', initialText: 'text-orange-800', industry: 'Real Estate', gmv: 2.77, gmvChange: 15.0, products: ['PG'], healthScore: 82, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: 'Today', lastInteractionType: 'New Sign-up' },
        { id: 'CONS44455566', name: 'Construction Crew', initial: 'CC', initialBg: 'bg-red-100', initialText: 'text-red-800', industry: 'Construction', gmv: 0.42, gmvChange: -0.5, products: ['POS'], healthScore: 41, status: 'At Risk', statusBg: 'bg-yellow-100', statusText: 'text-yellow-800', lastInteractionDate: '2 weeks ago', lastInteractionType: 'Email Campaign' },
        { id: 'FITN99988877', name: 'Fitness Plus Gym', initial: 'FP', initialBg: 'bg-green-100', initialText: 'text-green-800', industry: 'Fitness', gmv: 1.12, gmvChange: 9.3, products: ['PG', 'Engage'], healthScore: 90, status: 'Active', statusBg: 'bg-green-100', statusText: 'text-green-800', lastInteractionDate: '5 days ago', lastInteractionType: 'Product Training' }
    ];

    const tableBody = document.getElementById('merchant-table-body');
    const paginationInfo = document.getElementById('pagination-info');
    const paginationControls = document.getElementById('pagination-controls');
    const sortStatusSpan = document.getElementById('sortStatus');

    let currentMerchants = [...merchants];
    let currentPage = 1;
    const itemsPerPage = 5;

    // Sort state
    let currentSortKey = 'name';
    let currentSortDirection = 'asc';

    // Filter state - New state for multiple filters
    let currentFilters = [];

    const columnMap = {
        'name': 'MERCHANT',
        'industry': 'INDUSTRY',
        'gmv': 'GMV (MTD)',
        'products': 'PRODUCTS',
        'healthScore': 'HEALTH SCORE',
        'status': 'STATUS',
        'lastInteractionDate': 'LAST INTERACTION'
    };

    const operatorsMap = {
        'string': [
            { value: 'contains', text: 'contains' },
            { value: 'equals', text: 'equals' },
            { value: 'not-contains', text: 'does not contain' },
            { value: 'starts-with', text: 'starts with' }
        ],
        'number': [
            { value: 'equals', text: 'equals' },
            { value: 'greater-than', text: 'is greater than' },
            { value: 'less-than', text: 'is less than' }
        ]
    };

    const columnTypes = {
        'name': 'string',
        'industry': 'string',
        'gmv': 'number',
        'products': 'string-array',
        'healthScore': 'number',
        'status': 'string',
        'lastInteractionDate': 'string'
    };

    // Function to generate the health score badge color
    const getHealthScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Function to get health score text
    const getHealthScoreText = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Average';
        return 'Poor';
    };

    // Function to get status text color
    const getStatusText = (status) => {
         if (status === 'Active') return 'text-green-600';
         if (status === 'At Risk') return 'text-yellow-600';
         if (status === 'Inactive') return 'text-red-600';
         return 'text-gray-600';
    };

    // Function to render the table rows
    const renderTableRows = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-gray-500">No merchants found.</td></tr>`;
            return;
        }

        data.forEach(merchant => {
            const row = document.createElement('tr');
            row.className = 'merchant-table-row';

            const gmvChangeColor = merchant.gmvChange >= 0 ? 'text-green-600' : 'text-red-600';
            const gmvChangeSign = merchant.gmvChange >= 0 ? '+' : '';

            row.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${merchant.initialBg} ${merchant.initialText} font-semibold text-xs">${merchant.initial}</div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${merchant.name}</div>
                            <div class="text-xs text-gray-500">MID: ${merchant.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${merchant.industry}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                    <div class="text-gray-900">₹${merchant.gmv} Cr</div>
                    <div class="${gmvChangeColor} text-xs font-semibold">${gmvChangeSign}${merchant.gmvChange}%</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${merchant.products.map(p => `
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${p === 'PG' ? 'blue' : p === 'Neo' ? 'purple' : p === 'POS' ? 'yellow' : 'green'}-100 text-${p === 'PG' ? 'blue' : p === 'Neo' ? 'purple' : p === 'POS' ? 'yellow' : 'green'}-800 mr-1">${p}</span>
                    `).join('')}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                    <div class="flex items-center">
                        <span class="w-6 h-6 flex items-center justify-center rounded-full ${getHealthScoreColor(merchant.healthScore)} text-white text-xs font-bold mr-2">${merchant.healthScore}</span>
                        <span class="text-sm font-medium ${getStatusText(getHealthScoreText(merchant.healthScore))}">${getHealthScoreText(merchant.healthScore)}</span>
                    </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${merchant.statusBg} ${merchant.statusText}">${merchant.status}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="text-gray-900">${merchant.lastInteractionDate}</div>
                    <div class="text-xs text-gray-500">${merchant.lastInteractionType}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-blue-600 hover:text-blue-900">View</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Helper function to convert date strings to a comparable numeric value (days ago)
    const convertDateStringToDaysAgo = (dateString) => {
        if (dateString === 'Today') return 0;
        if (dateString === 'Yesterday') return 1;
        if (dateString.includes('days ago')) {
            return parseInt(dateString);
        }
        if (dateString.includes('week')) {
            return parseInt(dateString) * 7;
        }
        if (dateString.includes('month')) {
            return parseInt(dateString) * 30;
        }
        return Infinity;
    };

    // Master function to handle filtering and sorting
    const sortAndFilterData = () => {
        let tempMerchants = [...merchants];

        // 1. Apply Filters
        currentFilters.forEach(filter => {
            if (!filter.column || !filter.operator || !filter.value) return;

            const filterKey = filter.column;
            const filterOp = filter.operator;
            let filterVal = filter.value;
            const columnType = columnTypes[filterKey];

            if (columnType === 'string' || columnType === 'string-array') {
                filterVal = filterVal.toLowerCase();
            }
            if (columnType === 'number') {
                filterVal = parseFloat(filterVal);
            }

            tempMerchants = tempMerchants.filter(m => {
                const cellValue = m[filterKey];

                if (columnType === 'string') {
                    const stringValue = String(cellValue).toLowerCase();
                    if (filterOp === 'contains') return stringValue.includes(filterVal);
                    if (filterOp === 'equals') return stringValue === filterVal;
                    if (filterOp === 'not-contains') return !stringValue.includes(filterVal);
                    if (filterOp === 'starts-with') return stringValue.startsWith(filterVal);
                } else if (columnType === 'number') {
                    const numberValue = parseFloat(cellValue);
                    if (filterOp === 'equals') return numberValue === filterVal;
                    if (filterOp === 'greater-than') return numberValue > filterVal;
                    if (filterOp === 'less-than') return numberValue < filterVal;
                } else if (columnType === 'string-array') {
                     const arrayValues = cellValue.map(item => String(item).toLowerCase());
                     if (filterOp === 'contains') return arrayValues.some(item => item.includes(filterVal));
                }
                return false;
            });
        });

        // 2. Apply Sort
        tempMerchants.sort((a, b) => {
            const valA = a[currentSortKey];
            const valB = b[currentSortKey];
            let comparison = 0;

            if (typeof valA === 'string' && typeof valB === 'string') {
                if (currentSortKey === 'lastInteractionDate') {
                    const dateA = convertDateStringToDaysAgo(valA);
                    const dateB = convertDateStringToDaysAgo(valB);
                    comparison = dateA - dateB;
                } else {
                    comparison = valA.localeCompare(valB);
                }
            } else {
                comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
            }

            return currentSortDirection === 'asc' ? comparison : comparison * -1;
        });

        currentMerchants = tempMerchants;
        currentPage = 1;
        renderMerchantTable();
    };

    // --- Pagination Logic ---
    const renderPagination = (totalItems, itemsPerPage) => {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderMerchantTable();
            }
        });
        paginationControls.appendChild(prevButton);

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.className = 'pagination-button';
            firstPageButton.textContent = '1';
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                renderMerchantTable();
            });
            paginationControls.appendChild(firstPageButton);
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.className = 'text-sm text-gray-500 mx-1';
                dots.textContent = '...';
                paginationControls.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderMerchantTable();
            });
            paginationControls.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.className = 'text-sm text-gray-500 mx-1';
                dots.textContent = '...';
                paginationControls.appendChild(dots);
            }
            const lastPageButton = document.createElement('button');
            lastPageButton.className = 'pagination-button';
            lastPageButton.textContent = totalPages;
            lastPageButton.addEventListener('click', () => {
                currentPage = totalPages;
                renderMerchantTable();
            });
            paginationControls.appendChild(lastPageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderMerchantTable();
            }
        });
        paginationControls.appendChild(nextButton);
    };

    const renderMerchantTable = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = currentMerchants.slice(startIndex, endIndex);

        renderTableRows(paginatedData);
        renderPagination(currentMerchants.length, itemsPerPage);

        const startItem = paginatedData.length > 0 ? startIndex + 1 : 0;
        const endItem = startItem + paginatedData.length - 1;
        paginationInfo.innerHTML = `Showing <span class="font-medium">${startItem}</span> to <span class="font-medium">${endItem > 0 ? endItem : 0}</span> of <span class="font-medium">${currentMerchants.length}</span> merchants`;

    };

    // --- Filter Modal Logic (Updated) ---
    const filterButton = document.getElementById('filterButton');
    const filterModal = document.getElementById('filterModal');
    const filterConditionsContainer = document.getElementById('filter-conditions-container');
    const addFilterConditionBtn = document.getElementById('addFilterConditionBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

    // Function to generate a new filter condition row
    const createFilterRow = (filter = { column: 'name', operator: 'contains', value: '' }) => {
        const row = document.createElement('div');
        row.className = 'flex items-center space-x-2';
        row.innerHTML = `
            <select class="block w-48 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md filter-column-select">
                ${Object.entries(columnMap).map(([key, name]) =>
                    `<option value="${key}" ${key === filter.column ? 'selected' : ''}>${name}</option>`
                ).join('')}
            </select>
            <select class="block w-48 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md filter-operator-select">
                <!-- Operators will be dynamically populated -->
            </select>
            <input type="text" value="${filter.value}" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm filter-value-input" placeholder="Enter value">
            <button class="remove-filter-btn text-gray-500 hover:text-red-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        `;

        // Add event listeners for dynamic operator and value input changes
        const columnSelect = row.querySelector('.filter-column-select');
        const operatorSelect = row.querySelector('.filter-operator-select');
        const valueInput = row.querySelector('.filter-value-input');
        const removeButton = row.querySelector('.remove-filter-btn');

        const updateOperators = (selectedColumn) => {
            const type = columnTypes[selectedColumn];
            operatorSelect.innerHTML = '';
            if (type === 'string' || type === 'string-array') {
                operatorsMap.string.forEach(op => {
                    const option = document.createElement('option');
                    option.value = op.value;
                    option.textContent = op.text;
                    if (op.value === filter.operator) option.selected = true;
                    operatorSelect.appendChild(option);
                });
                valueInput.type = 'text';
            } else if (type === 'number') {
                operatorsMap.number.forEach(op => {
                    const option = document.createElement('option');
                    option.value = op.value;
                    option.textContent = op.text;
                    if (op.value === filter.operator) option.selected = true;
                    operatorSelect.appendChild(option);
                });
                valueInput.type = 'number';
            }
        };

        columnSelect.addEventListener('change', (e) => updateOperators(e.target.value));
        removeButton.addEventListener('click', () => row.remove());

        updateOperators(filter.column); // Initial population of operators

        return row;
    };

    const renderFilterModal = () => {
        filterConditionsContainer.innerHTML = '';
        if (currentFilters.length === 0) {
            addFilterCondition();
        } else {
            currentFilters.forEach(filter => {
                filterConditionsContainer.appendChild(createFilterRow(filter));
            });
        }
    };

    const addFilterCondition = () => {
        const newRow = createFilterRow();
        filterConditionsContainer.appendChild(newRow);
    };

    filterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        filterModal.classList.remove('hidden');
        renderFilterModal();
    });

    addFilterConditionBtn.addEventListener('click', addFilterCondition);

    applyFilterBtn.addEventListener('click', () => {
        const filterRows = filterConditionsContainer.querySelectorAll('.flex');
        currentFilters = [];
        filterRows.forEach(row => {
            const column = row.querySelector('.filter-column-select').value;
            const operator = row.querySelector('.filter-operator-select').value;
            const value = row.querySelector('.filter-value-input').value;
            if (column && operator && value) {
                currentFilters.push({ column, operator, value });
            }
        });
        filterModal.classList.add('hidden');
        sortAndFilterData();
    });

    clearAllFiltersBtn.addEventListener('click', () => {
        currentFilters = [];
        filterModal.classList.add('hidden');
        sortAndFilterData();
    });

    // --- Sort Modal Logic (New) ---
    const sortButton = document.getElementById('sortButton');
    const sortModal = document.getElementById('sortModal');
    const sortColumnSelect = document.getElementById('sort-column-select');
    const sortAscBtn = document.getElementById('sort-asc-btn');
    const sortDescBtn = document.getElementById('sort-desc-btn');
    const applySortBtn = document.getElementById('apply-sort-btn');
    const clearSortBtn = document.getElementById('clear-sort-btn');

    // Function to render the sort modal's UI based on current state
    const renderSortModal = () => {
        // Populate column select dropdown
        sortColumnSelect.innerHTML = Object.entries(columnMap).map(([key, name]) =>
            `<option value="${key}" ${key === currentSortKey ? 'selected' : ''}>${name}</option>`
        ).join('');

        // Highlight the active sort direction button
        [sortAscBtn, sortDescBtn].forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white', 'hover:bg-blue-600', 'focus:ring-blue-500');
            btn.classList.add('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200', 'focus:ring-gray-400');
        });

        if (currentSortDirection === 'asc') {
            sortAscBtn.classList.remove('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200', 'focus:ring-gray-400');
            sortAscBtn.classList.add('bg-blue-500', 'text-white', 'hover:bg-blue-600', 'focus:ring-blue-500');
        } else if (currentSortDirection === 'desc') {
            sortDescBtn.classList.remove('bg-gray-100', 'text-gray-800', 'hover:bg-gray-200', 'focus:ring-gray-400');
            sortDescBtn.classList.add('bg-blue-500', 'text-white', 'hover:bg-blue-600', 'focus:ring-blue-500');
        }
    };

    sortButton.addEventListener('click', (event) => {
        event.stopPropagation();
        sortModal.classList.remove('hidden');
        renderSortModal();
    });

    sortAscBtn.addEventListener('click', () => {
        currentSortDirection = 'asc';
        renderSortModal();
    });

    sortDescBtn.addEventListener('click', () => {
        currentSortDirection = 'desc';
        renderSortModal();
    });

    applySortBtn.addEventListener('click', () => {
        currentSortKey = sortColumnSelect.value;
        sortModal.classList.add('hidden');
        sortAndFilterData();
    });

    clearSortBtn.addEventListener('click', () => {
        currentSortKey = 'name';
        currentSortDirection = 'asc';
        sortModal.classList.add('hidden');
        sortAndFilterData();
    });


    // Initial render calls
    renderArrTrendChart();
    renderGmvByIndustryChart();
    sortAndFilterData();
});