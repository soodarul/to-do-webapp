const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const placeholder = document.getElementById("empty-state");

// Load tasks from localStorage on page load
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (tasks.length === 0) {
        placeholder.style.display = "flex";  // Show empty state if no tasks
    } else {
        placeholder.style.display = "none";  // Hide placeholder
        tasks.forEach(task => createTaskElement(task.text, task.completed));
    }
};

// Handle form submission to add a new task
const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTask();
};

// Add task from input
const handleAddTask = () => {
    const taskText = taskInput.value.trim();  // Trim input value to avoid empty spaces
    if (taskText) {
        createTaskElement(taskText);  // Create task element
        taskInput.value = "";  // Clear the input field after adding
    }
};

// Create a task element and append it to the list
const createTaskElement = (taskText, isCompleted = false) => {
    const li = document.createElement("li");
    
    // Create a span for the task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.classList.add("task-text");  // Add class for styling if needed

    // Create checkmark symbol
    const checkIcon = document.createElement("span");
    checkIcon.innerHTML = "&#x2713;";  // Checkmark symbol
    checkIcon.style.display = isCompleted ? "inline" : "none";  // Show if completed 
    checkIcon.classList.add("check-icon");

    // Append checkmark and task text to the list item
    li.appendChild(checkIcon);
    li.appendChild(taskSpan);

    // Create delete button
    const deleteButton = createDeleteButton(li);

    // Append delete button to the list item
    li.appendChild(deleteButton);

    if (isCompleted) {
        li.classList.add("completed");  // Mark as completed if needed
    }

    li.onclick = () => toggleCompleteTask(li, checkIcon);  // Toggle completion on click

    taskList.appendChild(li);

    updateLocalStorage();  // Update localStorage
    updatePlaceholder();  // Update placeholder visibility
};

// Create delete button for each task
const createDeleteButton = (li) => {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&times;";  // X icon for delete
    deleteButton.classList.add("delete-task");

    // Delete the task on button click
    deleteButton.onclick = (e) => {
        e.stopPropagation();  // Prevent event bubbling
        deleteTask(li);  // Remove the task
    };

    return deleteButton;
};

// Toggle task completion state
const toggleCompleteTask = (li, checkIcon) => {
    li.classList.toggle("completed");  // Toggle completed class
    checkIcon.style.display = li.classList.contains("completed") ? "inline" : "none";  // Toggle checkmark display

    updateLocalStorage();  // Save the updated state in localStorage
};

// Delete a task and update localStorage
const deleteTask = (li) => {
    li.remove();  // Remove task element from the DOM
    updateLocalStorage();  // Update localStorage with new task list
    updatePlaceholder();  // Update placeholder visibility
};

// Save the task list to localStorage
const updateLocalStorage = () => {
    const tasks = [...document.querySelectorAll("li")].map(li => ({
        text: li.querySelector(".task-text").textContent,  // Get task text
        completed: li.classList.contains("completed"),  // Check completion status
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));  // Save tasks to localStorage
};

// Update placeholder visibility depending on task list
const updatePlaceholder = () => {
    if (taskList.children.length === 0) {
        placeholder.style.display = "block";  // Show placeholder if no tasks
    } else {
        placeholder.style.display = "none";  // Hide placeholder if tasks exist
    }
};

// Add task on Enter key press
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleAddTask();
    }
});

// Load tasks on page load
loadTasks();
