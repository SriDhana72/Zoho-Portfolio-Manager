// You can add your JavaScript logic here
// Example: A simple alert when the button is clicked (using a custom modal for better UX)
function showAlert(message) {
    const container = document.querySelector('.main-page-wrapper'); // Target the main wrapper or body
    const alertBox = document.createElement('div');
    alertBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50';
    alertBox.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p class="text-xl font-semibold mb-4 text-gray-800">${message}</p>
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onclick="this.closest('.fixed').remove()">
                OK
            </button>
        </div>
    `;
    document.body.appendChild(alertBox);
}

// Example of how you might attach an event listener if there was a button in script2.js
// If you add a button to your HTML that needs this function, make sure its onclick calls showAlert
// For instance: <button onclick="showAlert('Your custom message!')">Show Alert</button>
