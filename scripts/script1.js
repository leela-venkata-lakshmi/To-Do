const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskInput = document.getElementById("taskInput");
const enterBtn = document.getElementById("enterBtn");
const themeBtn= document.getElementById("themeBtn");
const forTheme=document.getElementById("forTheme");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};
document.addEventListener('DOMContentLoaded', function() {
    updateTodoList();
});



themeBtn.addEventListener("click",()=>{
    const themeColor=forTheme.getAttribute("data-bs-theme");
    if(themeColor==="dark")
    {
        forTheme.setAttribute("data-bs-theme","light");
        themeBtn.innerHTML=`<i class="bi bi-moon"></i>`;
    }else{
        forTheme.setAttribute("data-bs-theme","dark");
        themeBtn.innerHTML=`<i class="bi bi-sun"></i>`;
    }

})



addBtn.addEventListener("click", () => {
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");
});

enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    taskInput.classList.add("hidden");
    enterBtn.classList.add("hidden");
    addOrUpdate();
});

const updateTodoList = () => {
     todoList.innerHTML = "";
    taskData.forEach(({ id, taskInfo }) => {
        todoList.innerHTML += `
            <div class="row task border bg-primary-subtle p-1 m-2 rounded" id="${id}" draggable="true">
                <p class="col-10 pt-2">${taskInfo}</p>
                <button type="button" class="icon-btn col-1 bg-primary-subtle" aria-label="Edit" onclick="edit(this)">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="icon-btn col-1 bg-primary-subtle" onclick="Delete(this)" aria-label="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;
    });
};

function Delete(buttonEl) {
    const taskId = buttonEl.parentElement.id;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData.splice(dataIndex, 1);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function edit(buttonEl) {
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");

    const taskId = buttonEl.parentElement.id;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        currentTask = taskData[dataIndex];
        taskInput.value = currentTask.taskInfo;
    }
}

const addOrUpdate = () => {
    const taskInfo = taskInput.value.trim();

    if (!taskInfo) return; // Prevent adding empty tasks

    if (currentTask.id) {
        // Update existing task
        const dataIndex = taskData.findIndex(item => item.id === currentTask.id);
        if (dataIndex !== -1) {
            taskData[dataIndex].taskInfo = taskInfo;
            localStorage.setItem("data", JSON.stringify(taskData));
            updateTodoList();
        }
        currentTask = {}; // Reset currentTask after updating
    } else {
        // Add new task
        const taskObj = {
            id: Date.now(),
            taskInfo
        };
        taskData.unshift(taskObj);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}


// Handle drag start
todoList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task')) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
    }
});

// Handle drag end
todoList.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
});

// Handle drag over (to allow dropping)
todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        todoList.appendChild(dragging);
    } else {
        todoList.insertBefore(dragging, afterElement);
    }
});

// Get the element to place the dragged item before
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update the task order after dragging
todoList.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);

    const newOrder = [...todoList.querySelectorAll('.task')].map(el => parseInt(el.id, 10));
    const oldIndex = taskData.findIndex(task => task.id === parseInt(draggedId, 10));
    if (oldIndex !== -1) {
        const [draggedTask] = taskData.splice(oldIndex, 1);
        const newIndex = newOrder.indexOf(parseInt(draggedId, 10));
        taskData.splice(newIndex, 0, draggedTask);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
});

