const checklist = document.getElementById('checklist');
const newItemForm = document.getElementById('new-item-form');
const newItemInput = document.getElementById('new-item-input');

// Load any existing items from storage
browser.storage.local.get('items').then(function(result) {
  if (result.items) {
    result.items.forEach(function(item) {
      addItem(item.text, item.checked);
    });
  }
});

// Add a new item to the checklist
function addItem(text, checked) {
  const item = document.createElement('li');
  item.className = 'checklist-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', function() {
    // Update the item in storage
    const items = Array.from(checklist.querySelectorAll('li'))
      .map(function(item) {
        return { text: item.querySelector('label').textContent, checked: item.querySelector('input[type="checkbox"]').checked };
      });
    browser.storage.local.set({ items: items });
  });

  const label = document.createElement('label');
  label.textContent = text;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function() {
    item.remove();
    // Update the items in storage
    const items = Array.from(checklist.querySelectorAll('li'))
      .map(function(item) {
        return { text: item.querySelector('label').textContent, checked: item.querySelector('input[type="checkbox"]').checked };
      });
    browser.storage.local.set({ items: items });
  });

  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(removeButton);
  checklist.appendChild(item);
}

// Handle the form submission to add a new item
newItemForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const text = newItemInput.value.trim();
  if (text) {
    addItem(text, false);
    newItemInput.value = '';
    // Update the items in storage
    const items = Array.from(checklist.querySelectorAll('li'))
      .map(function(item) {
        return { text: item.querySelector('label').textContent, checked: item.querySelector('input[type="checkbox"]').checked };
      });
    browser.storage.local.set({ items: items });
  }
});
