// Initialize variables and select elements from the DOM
const addButton = document.querySelector('.add-btn');
const itemContainer = document.querySelector('.item-container');
const categoryButtons = document.querySelectorAll('.category-button');
let uniqueIDCounter = 1;
let todoList = [];

// Check if there is data in local storage
if (localStorage.getItem('todoList')) {

    todoList = JSON.parse(localStorage.getItem('todoList'));

    todoList.forEach(item => {
        const newListDiv = createListItem(item.id, item.text, item.completed);
        itemContainer.appendChild(newListDiv);
    });
}

// Add a click event listener to the "ADD" button
addButton.addEventListener('click', () => {
    // Get user input from the text input field
    const userInput = document.querySelector('input[name="todo-list"]').value;

    // Check if the input is not empty
    if (userInput.trim() !== '') {
        // Generate a unique ID for the new item
        const uniqueID = `item-${uniqueIDCounter}`;
        uniqueIDCounter++;

        // Create a new todo item object
        const newItem = {
            id: uniqueID,
            text: userInput,
            completed: false
        };

        // Add the new item to the todoList array
        todoList.push(newItem);

        // Create and display a new list item in the DOM
        const newListDiv = createListItem(newItem.id, newItem.text, newItem.completed);
        itemContainer.appendChild(newListDiv);

        // Clear the input field
        document.querySelector('input[name="todo-list"]').value = '';

        // Save the updated todoList to local storage
        saveTodoListToLocalStorage();
    } else {
        // Display an error message if the input is empty
        const errorMessage = document.createElement('div');
        errorMessage.textContent = "Please enter a value";
        errorMessage.style.color = "red";
        itemContainer.appendChild(errorMessage);

        // Remove the error message after 2 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 2000);
    }
});

// Function to create a new todo list item 
function createListItem(id, text, completed) {
    const newListDiv = document.createElement('div');
    newListDiv.classList.add('item');
    newListDiv.id = id;

    // Create a checkbox input element
    const newCheckboxDiv = document.createElement('div');
    newCheckboxDiv.classList.add('checkbox');
    const newCheckbox = document.createElement('input');
    newCheckbox.classList.add('underlined-label');
    newCheckbox.type = 'checkbox';
    newCheckbox.id = `myCheckbox-${id}`;
    newCheckbox.name = 'list';
    newCheckbox.value = 'yes';
    newCheckbox.checked = completed;
    newCheckboxDiv.appendChild(newCheckbox);

    // Event listener for checkbox change 
    newCheckbox.addEventListener('change', (event) => {
        // Get the item index and update the completion status
        const target = event.target;
        const itemDiv = target.closest('.item');
        const itemId = itemDiv.id;
        const itemIndex = todoList.findIndex(item => item.id === itemId);

        if (target.checked) {
            itemDiv.classList.add('checked');
            if (itemIndex !== -1) {
                todoList[itemIndex].completed = true;
            }
        } else {
            itemDiv.classList.remove('checked');
            if (itemIndex !== -1) {
                todoList[itemIndex].completed = false;
            }
        }

        // Save the updated todoList to local storage

        saveTodoListToLocalStorage();
    });

    // Create a label for the todo item
    const label = document.createElement("label");
    label.setAttribute("for", `myCheckbox-${id}`);
    label.textContent = text;
    newCheckboxDiv.appendChild(label);

    // Create the edit icon
    const editIconDiv = document.createElement('div');
    editIconDiv.classList.add('edit-icon');
    const editIcon = document.createElement('i');
    editIconDiv.appendChild(editIcon);
    editIcon.classList.add('fa-solid', 'fa-pen-to-square');

    // Event listener for edit icon 
    editIconDiv.addEventListener('click', () => {
        const newText = prompt("Edit the item:", text);
        if (newText !== null) {
            label.textContent = newText;

            // Get the item index and update the text
            const itemIndex = todoList.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                todoList[itemIndex].text = newText;
            }

            // Save the updated todoList to local storage
            saveTodoListToLocalStorage();
        }
    });

    // Create the delete icon
    const xIconDiv = document.createElement('div');
    xIconDiv.classList.add('delete-icon');
    const xIcon = document.createElement('i');
    xIconDiv.appendChild(xIcon);
    xIcon.classList.add('fa-solid', 'fa-xmark');

    // Event listener for delete icon
    xIconDiv.addEventListener('click', () => {
        // Get the item index and remove the item
        const itemDiv = newListDiv;
        const itemId = itemDiv.id;
        const itemIndex = todoList.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            todoList.splice(itemIndex, 1);
        }

        itemDiv.remove();

        // Save the updated todoList to local storage
        saveTodoListToLocalStorage();
    });

    // Append the elements to the new todo list item
    newListDiv.appendChild(newCheckboxDiv);
    newListDiv.appendChild(editIconDiv);
    newListDiv.appendChild(xIconDiv);

    return newListDiv;
}

// Event listener for category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const category = event.target.id;

        // Remove the 'active-category-button' class from all buttons
        categoryButtons.forEach(btn => {
            btn.classList.remove('active-category-button');
        });

        event.target.classList.add('active-category-button');

        displayItems(category);
    });
});

// display items based on the selected category
function displayItems(category) {
    const items = document.querySelectorAll('.item');

    items.forEach((item) => {
        const completed = item.classList.contains('checked');
        switch (category) {
            case "all":
                item.style.display = "flex";
                break;
            case "active":
                item.style.display = completed ? "none" : "flex";
                break;
            case "complete":
                item.style.display = completed ? "flex" : "none";
                break;
        }
    });
}

//save the updated todoList to local storage
function saveTodoListToLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
