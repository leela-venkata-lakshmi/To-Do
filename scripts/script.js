const addBtn=document.getElementById("addBtn");
const todoList=document.getElementById("todoList");
const taskInput=document.getElementById("taskInput");
const enterBtn=document.getElementById("enterBtn");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

addBtn.addEventListener("click",()=>{
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");
})

enterBtn.addEventListener("click",(e)=>{
    e.preventDefault();  
    taskInput.classList.add("hidden");
    enterBtn.classList.add("hidden");
    addOrUpdate();
    // updateTodoList();
})

const updateTodoList =()=>{
    todoList.innerHTML="";
    taskData.forEach(({id,taskInfo}) => {
        todoList.innerHTML+=`
    <div class="row task border bg-primary-subtle p-1 m-2 rounded" id=${id}>
    <p class="col-10 pt-2"> ${taskInfo}</p>
    <button type="button" class="icon-btn col-1 bg-primary-subtle" aria-label="Edit" onclick="edit(this)">
        <i class="bi bi-pencil"></i>
    </button>
    <button type="button" class="icon-btn col-1 bg-primary-subtle" onclick="Delete(this)" aria-label="Delete">
        <i class="bi bi-trash "></i>
    </button>
    </div>`
}
        
    )};

    

function Delete(buttonEl) {
    
    const dataIndex = taskData.findIndex(
        (item) => item.id === buttonEl.parentElement.id
      );
    
      buttonEl.parentElement.remove();
      taskData.splice(dataIndex, 1);
      localStorage.setItem("data", JSON.stringify(taskData));
      updateTodoList();
}

function edit(buttonEl)
{
    // taskInput.value=buttonEl.previousElementSibling.innerText;
    taskInput.classList.remove("hidden");
    enterBtn.classList.remove("hidden");

    const dataIndex = taskData.findIndex(
        (item) => item.id === buttonEl.parentElement.id
      );
      currentTask = taskData[dataIndex];
      taskInput.value=currentTask.taskInfo;
    // button.previousElementSibling.innerText=taskInput.value;
}

const addOrUpdate= ()=>{
    const dataIndex= taskData.findIndex((item)=> item.id=== currentTask.id);
    const taskObj= {
        id: Date.now(),
        taskInfo: taskInput.value,
    }
    if (dataIndex === -1) {
        taskData.unshift(taskObj);
      } else {
        taskData[dataIndex] = taskObj;
      }
    
      localStorage.setItem("data", JSON.stringify(taskData));
      updateTodoList();

}