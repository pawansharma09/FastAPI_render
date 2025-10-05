document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    const itemList = document.getElementById('item-list');
    const messageDiv = document.getElementById('message');

    // Load items on page load
    loadItems();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch('/items/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            });

            if (response.ok) {
                showMessage('Item added successfully!', 'success');
                form.reset();
                loadItems();
            } else {
                throw new Error('Failed to add item');
            }
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        }
    });

    // Load items from API
    async function loadItems() {
        try {
            const response = await fetch('/items/');
            const items = await response.json();
            renderItems(items);
        } catch (error) {
            showMessage('Error loading items: ' + error.message, 'error');
        }
    }

    // Render items in the list
    function renderItems(items) {
        itemList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h3>${escapeHtml(item.name)}</h3>
                    <p>${escapeHtml(item.description || '')}</p>
                </div>
                <button class="delete" data-id="${item.id}">Delete</button>
            `;
            itemList.appendChild(itemElement);
        });

        // Add delete event listeners
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', deleteItem);
        });
    }

    // Delete item
    async function deleteItem(e) {
        const id = e.target.dataset.id;
        try {
            const response = await fetch(`/items/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showMessage('Item deleted!', 'success');
                loadItems();
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            showMessage('Error: ' + error.message, 'error');
        }
    }

    // Show message helper
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }

    // Prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});