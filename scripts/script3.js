const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskInput = document.getElementById("taskInput");
const enterBtn = document.getElementById("enterBtn");
const themeBtn = document.getElementById("themeBtn");
const forTheme = document.getElementById("forTheme");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const reminderTime = document.getElementById('reminderTime');
const inputDiv=document.getElementById("inputDiv");




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
    taskInput.value = "";
});

enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    taskInput.classList.add("hidden");
    enterBtn.classList.add("hidden");
    addOrUpdate();
});

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




const updateTaskDate = (dateInput, taskId) => {
    const newDate = dateInput.value;
    const dataIndex = taskData.findIndex((item) => item.id === parseInt(taskId, 10));

    if (dataIndex !== -1) {
        taskData[dataIndex].date = newDate;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function updateEndTime(endTime, taskId) {
    const newTime = endTime.value;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].endTime = newTime;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function updateStartTime(startTime, taskId) {
    const newTime = startTime.value;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].startTime = newTime;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}



const addOrUpdate = () => {
    // e.preventDefault();
    const taskInfo = taskInput.value.trim();
    const priority = 'medium';
     
    if (!taskInfo) return;

    if (currentTask.id) {
        const dataIndex = taskData.findIndex(item => item.id === currentTask.id);
        // const reminderTime = document.querySelector(".reminderInput").value || 0;
        if (dataIndex !== -1) {
            taskData[dataIndex].taskInfo = taskInfo;
            taskData[dataIndex].priority = priority;
            // taskData[dataIndex].reminderTime = reminderTime;
            localStorage.setItem("data", JSON.stringify(taskData));
            updateTodoList();
        }
        currentTask = {};
    } else {
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

const updateTodoList = (tasks = taskData) => {
    todoList.innerHTML = "";
    
    tasks.forEach(({ id, taskInfo, date, startTime, endTime, priority, subTasks = [] }) => {
        todoList.innerHTML += `
<div class="container" id="${id}_Div">
    <div class="row task border bg-primary-subtle p-1 m-2 rounded" id="${id}" draggable="true" data-priority="${priority}">
        <div class=" col-md-6 col-lg-3 " >
            <h3 class="p-2 ">${taskInfo}</h3>   
        </div>
        <div class=" col-md-6 col-lg-2 ">
            <input type="date" placeholder="Choose Date" class="form-control" value="${date || ''}" onchange="updateTaskDate(this, ${id})">
        </div>
       
        <div class="col-md-3 col-lg-2">
            <select class="form-select" onchange="changePriority(this, ${id})" aria-label="Priority">
                <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
                <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
            </select>
        </div>
         <div class=" col-md-3 col-lg-2">
            <input type="time"  class="form-control p-0 startTime" value="${startTime || ''}" onchange="updateStartTime(this, ${id})" placeholder="Start Time">
           
            <input type="time" class="form-control p-0 endTime" value="${endTime || ''}" onchange="updateEndTime(this, ${id})" placeholder="End Time">
            
        </div>
        <div class=" col-md-4 col-lg-2  d-flex align-items-center border ">
            <input  placeholder="seconds" type="number" id="reminderTime" min="1" class="remindeInput m-0 p-2 rounded border"  >
           
            <button class=" rounded btn bg-primary text-white m-0 " onclick="setReminder()"><i class="bi bi-bell "></i></button>
            </div>
       
        <div  class="d-flex align-items-center  col-md-2 col-lg-1">
            <button type="button" class="icon-btn bg-primary-subtle" aria-label="Edit" onclick="edit(this, ${id})">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="icon-btn bg-primary-subtle ms-2" onclick="Delete(this, ${id})" aria-label="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </div>
            <div class="d-flex align-items-center justify-content-center mt-1">
            
            <button id="subTaskBtn_${id}" class="btn bg-success text-white rounded border p-2 " onclick="subTask(${id})"> Add Sub-Task </button>
            <button class="btn bg-success text-white rounded border p-2 "   onclick="toggleSubList(${id})" ><i id="toggleIcon_${id}" class="bi bi-chevron-down"></i></button>
             </div>
    </div>
    <div class="d-flex m-4 align-items-center justify-content-center" id="${id}_inputDiv">
        <input type="text" class="form-control hidden  w-25 subTaskInput" id="taskInput_${id}" placeholder="Enter sub task">
        <button class="btn btn-primary hidden" id="enterBtn_${id}" onclick="enterSubTask('${id}')">Enter</button>
    </div>
    <div id="${id}_subTodoList" class="ms-4 p-3 " draggable="true">
             ${subTasks.map(subTask => `
            <div class="sub-task border bg-secondary-subtle p-2 m-2 rounded  ">
                 <div class="row">

                <h5 class="col-md-10 p-3" id="subTaskText_${subTask.id}">${subTask.text}</h5>
                <div class="col-md-2">
                <button type="button" class="icon-btn bg-secondary-subtle" aria-label="Edit" id="editSubTaskBtn_${subTask.id}" onclick="editSubTask(${id}, ${subTask.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="icon-btn bg-secondary-subtle" aria-label="Delete" onclick="deleteSubTask(${id}, ${subTask.id})">
                    <i class="bi bi-trash"></i>
                </button>
                </div>
                </div>
                <div class="row">
                    <div class="col-md-3 col-lg-3">
                        <input type="date" class="form-control" value="${subTask.date || ''}" onchange="updateSubTaskDate(this, ${id}, ${subTask.id})">
                    </div>
                       <div class="col-md-2 col-lg-3">
                        <select class="form-select" onchange="changeSubTaskPriority(this, ${id}, ${subTask.id})" aria-label="Priority">
                            <option value="high" ${subTask.priority === 'high' ? 'selected' : ''}>High</option>
                            <option value="medium" ${subTask.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="low" ${subTask.priority === 'low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-lg-3">
                        <input type="time" class="form-control startTime p-0" value="${subTask.startTime || ''}" onchange="updateSubTaskStartTime(this, ${id}, ${subTask.id})" placeholder="Start Time">
                        <input type="time" class="form-control endTime p-0" value="${subTask.endTime || ''}" onchange="updateSubTaskEndTime(this, ${id}, ${subTask.id})" placeholder="End Time">
                    </div>
                  
                    <div class="col-md-4 col-lg-3 d-flex align-items-center ">
                        
                        <input type="number" class="subRemindeInput  m-0 p-2 rounded border" id="reminderTime_${subTask.id}" min="1" placeholder="Seconds" value="${subTask.reminderTime || ''}">
                        <button  class="rounded btn bg-secondary text-white m-0" onclick="setSubTaskReminder(${id}, ${subTask.id})"><i class="bi bi-bell "></i></button>
                    </div>
                </div>
                
            </div>
        `).join('')}
    </div>
</div>`
    });
};


function toggleSubList(id) {
    const subTodoList = document.getElementById(`${id}_subTodoList`);
    const toggleIcon = document.getElementById(`toggleIcon_${id}`);
    
    if (subTodoList) {
        if (subTodoList.classList.contains('hidden')) {
            subTodoList.classList.remove('hidden');
            toggleIcon.classList.remove('bi-chevron-down');
            toggleIcon.classList.add('bi-chevron-up');
        } else {
            subTodoList.classList.add('hidden');
            toggleIcon.classList.remove('bi-chevron-up');
            toggleIcon.classList.add('bi-chevron-down');
        }
    } 
}



function subTask(buttonId)
{
    const subTaskInput=document.getElementById(`taskInput_${buttonId}`);
    const subEnterBtn=document.getElementById(`enterBtn_${buttonId}`);
   
    subTaskInput.classList.remove("hidden");
    subEnterBtn.classList.remove("hidden");
}

function enterSubTask(taskId) {
    const subTaskInput = document.getElementById(`taskInput_${taskId}`);
    const subTaskText = subTaskInput.value.trim();
    
    if (subTaskText === "")
    { 
       return;
    }
    
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    if (dataIndex === -1) return;
    
    if (!taskData[dataIndex].subTasks) {
        taskData[dataIndex].subTasks = [];
    }
   
        taskData[dataIndex].subTasks.push({
            id: Date.now(), // Unique ID for each sub-task
            text: subTaskText
        });
    
    

    localStorage.setItem("data", JSON.stringify(taskData));
    updateTodoList(); // Re-render the list to include sub-tasks
}





function deleteSubTask(taskId, subTaskId) {
    const taskIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (taskIndex !== -1) {
        taskData[taskIndex].subTasks = taskData[taskIndex].subTasks.filter(subTask => subTask.id !== subTaskId);
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList(); // Re-render the list to remove the deleted sub-task
    }
}

function editSubTask(taskId, subTaskId)
{
 subTask();   
}


function updateSubTaskDate(inputEl, taskId, subTaskId) {
    const taskIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    if (taskIndex !== -1) {
        const subTaskIndex = taskData[taskIndex].subTasks.findIndex(subTask => subTask.id === subTaskId);
        if (subTaskIndex !== -1) {
            taskData[taskIndex].subTasks[subTaskIndex].date = inputEl.value;
            localStorage.setItem("data", JSON.stringify(taskData));
        }
    }
}


function updateSubTaskStartTime(inputEl, taskId, subTaskId) {
    const taskIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    if (taskIndex !== -1) {
        const subTaskIndex = taskData[taskIndex].subTasks.findIndex(subTask => subTask.id === subTaskId);
        if (subTaskIndex !== -1) {
            taskData[taskIndex].subTasks[subTaskIndex].startTime = inputEl.value;
            localStorage.setItem("data", JSON.stringify(taskData));
        }
    }
}

function updateSubTaskEndTime(inputEl, taskId, subTaskId) {
    const taskIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    if (taskIndex !== -1) {
        const subTaskIndex = taskData[taskIndex].subTasks.findIndex(subTask => subTask.id === subTaskId);
        if (subTaskIndex !== -1) {
            taskData[taskIndex].subTasks[subTaskIndex].endTime = inputEl.value;
            localStorage.setItem("data", JSON.stringify(taskData));
        }
    }
}






searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredTasks = taskData.filter(task => task.taskInfo.toLowerCase().includes(query));
       
        
    // filteredTasks.append(taskData.filter(task => {
    //     if(task.subTasks)
    //     {
    //         if(task.subTasks.text)
    //         {
    //             task.subTasks.text.toLowerCase().includes(query)  
    //         }
    //     }
    // } ))
    updateTodoList(filteredTasks);   
});








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






function changePriority(selectEl, taskId) {
    const newPriority = selectEl.value;
    const dataIndex = taskData.findIndex(item => item.id === parseInt(taskId, 10));
    
    if (dataIndex !== -1) {
        taskData[dataIndex].priority = newPriority;
        localStorage.setItem("data", JSON.stringify(taskData));
        updateTodoList();
    }
}

function changeSubTaskPriority(selectEl, taskId, subTaskId)
{
    const newPriority =selectEl.value;
    const dataIndex = taskData.findIndex(item=> item.id === parseInt(taskId, 10));
    if(dataIndex !== -1)
    {
        const subDataIndex=taskData[dataIndex].subTasks.findIndex(item => item.id === parseInt(subTaskId,10));
        if(subDataIndex!==-1)
        {
            taskData[dataIndex].subTasks[subDataIndex].priority=newPriority;
            localStorage.setItem("data", JSON.stringify(taskData));
            updateTodoList();
        }
    }
}



document.getElementById("export").addEventListener('click', (e) => {
    const blob = new Blob([JSON.stringify(taskData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskData.json';
    a.click();
    URL.revokeObjectURL(url);
});

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
                taskData.push(...dataa);
                localStorage.setItem("data", JSON.stringify(taskData));
                updateTodoList();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    } else {
        console.error('Please select a valid JSON file.');
    }
});


function setReminder() {
    const reminderTime = document.getElementById('reminderTime').value;
    
    if (!reminderTime || isNaN(reminderTime) || reminderTime <= 0) {
        alert("Please enter a valid time in seconds.");
        return;
    }else{
        scheduleNotification(parseInt(reminderTime) * 1000);
    }
}

if ("Notification" in window)
    {

        if(Notification.permission === 'granted')
        {
            // notify();
     
            
        }else{
            Notification.requestPermission().then((res) => {
                if (res === 'granted')
                {
                    // notify();
                    // const reminderTime = document.getElementById('reminderTime').value;
                    // scheduleNotification(parseInt(reminderTime.value) * 1000);
                }else if(res === 'denied')
                {
                    console.log("Notification access denied");
                }else if(res==='default')
                {
                    console.log("Notification permission not given");
                }
            })
        }
    }else{
        console.error("Notification not supported");
    }
    
    function scheduleNotification(delay) {
        setTimeout(() => {
            new Notification("Reminder!", {
                body: "It's time TO-DO ",
                icon: "assets/todo.png"
            });
        }, delay);
    }



    
    function setSubTaskReminder(taskId, subTaskId) {
        const reminderInput = document.getElementById(`reminderTime_${subTaskId}`);
        const reminderTime = parseInt(reminderInput.value, 10);
        if (isNaN(reminderTime) || reminderTime <= 0) return;
        scheduleNotification(parseInt(reminderTime) * 1000);
        
    }
    


 

   
    