const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskInput = document.getElementById("taskInput");
const enterBtn = document.getElementById("enterBtn");
const themeBtn= document.getElementById("themeBtn");
const forTheme=document.getElementById("forTheme");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
// const taskDate= document.getElementById("taskDate");
// const taskDuration= document.getElementById("taskDuration");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

document.addEventListener('DOMContentLoaded', function() {
    updateTodoList();
    sortTasks("priority");
});

themeBtn.addEventListener("click", () => {
    const themeColor = forTheme.getAttribute("data-bs-theme");
    if (themeColor === "dark") {
        forTheme.setAttribute("data-bs-theme", "light");
        themeBtn.innerHTML = `<i class="bi bi-moon"></i>`;
    } else {
        forTheme.setAttribute("data-bs-theme", "dark");
        themeBtn.innerHTML = `<i class="bi bi-sun"></i>`;
    }
});

addBtn.addEventListener("click", () => {
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");
    taskInput.value="";
});

enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    taskInput.classList.add("hidden");
    enterBtn.classList.add("hidden");
    addOrUpdate();
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filterTasks(query);
});

const filterTasks = (query) => {
    const filteredTasks = taskData.filter(task =>
        task.taskInfo.toLowerCase().includes(query)
    );
    updateTodoList(filteredTasks);
};


const updateTodoList = (tasks = taskData) => {
    todoList.innerHTML = "";
    tasks.forEach(({ id, taskInfo, date,startTime,endTime , priority }) => {
        todoList.innerHTML += `
            <div class="row task border bg-primary-subtle p-1 m-2 rounded" id="${id}" draggable="true" data-priority="${priority}">
                <div class="col-2">
                    <input type="date" placeholder="Choose Date" class="form-control" value="${date || ''}" onchange="updateTaskDate(this, ${id})">
                </div>
               
                <div class="col-2">
                    <input type="time" class="form-control p-0" value="${startTime || ''}" onchange="updateStartTime(this, ${id})" placeholder="Start Time">
                    <input type="time" class="form-control p-0" value="${endTime || ''}" onchange="updateEndTime(this, ${id})" placeholder="End Time">
                </div>

                <div class="col-5">
                   <p class="pt-2">${taskInfo}</p>
                </div>
                <div class="col-2">
                    <select class="form-select" onchange="changePriority(this, ${id})" aria-label="Priority">
                        <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
                    </select>
                </div>
                <div class="col-1 d-flex align-items-center">
                    <button type="button" class="icon-btn bg-primary-subtle" aria-label="Edit" onclick="edit(this, ${id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="icon-btn bg-primary-subtle ms-2" onclick="Delete(this, ${id})" aria-label="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    
};

const updateTaskDate=(dateInput,taskId) =>{
    const newDate= dateInput.value;
    const dataIndex=taskData.findIndex((item)=> item.id=== parseInt(taskId,10));

    if(dataIndex!==-1)
    {
        taskData[dataIndex].date=newDate;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }

}

function updateEndTime(endTime, taskId) {
    const newTime = endTime.value; // Default to 0 if invalid
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].endTime = newTime;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function updateStartTime(startTime, taskId) {
    const newTime = startTime.value; // Default to 0 if invalid
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].startTime = newTime;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function Delete(buttonEl, taskId) {

    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData.splice(dataIndex, 1);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function edit(buttonEl, taskId) {
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");

    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        currentTask = taskData[dataIndex];
        taskInput.value = currentTask.taskInfo;
    }
}

sortSelect.addEventListener("change", () => {
    const sortBy = sortSelect.value;
    sortTasks(sortBy);
});

const sortTasks = (criteria) => {
    let sortedTasks;

    switch (criteria) {
        case 'priority':
            sortedTasks = [...taskData].sort((a, b) => {
                const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            break;
        case 'dateTime':
            sortedTasks = [...taskData].sort((a, b) => {
                const dateTimeA = new Date(`${a.date}T${a.startTime}`);
                const dateTimeB = new Date(`${b.date}T${b.startTime}`);
                return dateTimeA - dateTimeB;
            });
            break;
        default:
            sortedTasks = taskData;
    }

    updateTodoList(sortedTasks);
};

const addOrUpdate = () => {
    const taskInfo = taskInput.value.trim();
    
    // const priority = document.querySelector('input[name="priority"]:checked').value; // Adjust if using select dropdown
    const priority='medium';
    if (!taskInfo) return; // Prevent adding empty tasks

    if (currentTask.id) {
        // Update existing task
        const dataIndex = taskData.findIndex(item => item.id === currentTask.id);
        if (dataIndex !== -1) {
            taskData[dataIndex].taskInfo = taskInfo;
            taskData[dataIndex].priority = priority;
            localStorage.setItem("data", JSON.stringify(taskData));
            updateTodoList();
        }
        currentTask = {}; // Reset currentTask after updating
    } else {
        // Add new task
        const taskObj = {
            id: Date.now(),
            taskInfo,
            priority
        };
        taskData.unshift(taskObj);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function changePriority(selectEl, taskId) {
    const newPriority = selectEl.value;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].priority = newPriority;
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
    // const draggedId = e.dataTransfer.getData('text/plain');
    // const draggedElement = document.getElementById(draggedId);

    const newOrder = [...todoList.querySelectorAll('.task')].map(el => parseInt(el.id, 10));
    const oldIndex = taskData.findIndex(task => task.id === parseInt(draggedId, 10));
    if (oldIndex !== -1) {
        const [draggedTask] = taskData.splice(oldIndex, 1);
        const newIndex = newOrder.indexOf(parseInt(draggedId, 10));
        taskData.splice(newIndex, 0, draggedTask);

        // Re-sort tasks by priority
        taskData.sort((a, b) => {
            const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
});

document.getElementById("export").addEventListener('click',(e)=>{
    const blob = new Blob([JSON.stringify(taskData)],
     { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskData.json';
    a.click();
    URL.revokeObjectURL(url);
}
)
document.getElementById("import").addEventListener('click', () => {
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dataa = JSON.parse(event.target.result);
                // console.log(data);
                // debugger;
                tasks = tasks.concat(dataa);
                console.log('Tasks imported successfully:', tasks);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            updateTodoList();
            // saveTask()
        };
        reader.readAsText(file);
    } else {
        console.error('Please select a valid JSON file.');
    }
});


