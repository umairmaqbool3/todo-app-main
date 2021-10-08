

showTasks(); 

//  Theme Changing Function
let lightMode = localStorage.getItem('lightMode'); 
const lightModeToggle = document.querySelector('#dark-mode-toggle');
var imgSrc = document.querySelector(".icon-sun");
const enableLightMode = () => {
  document.body.classList.add('lightmode');
  localStorage.setItem('lightMode', 'enabled');
}
const disableLightMode = () => {
  document.body.classList.remove('lightmode');
  localStorage.setItem('lightMode', null);
}
if (lightMode === 'enabled') {
  enableLightMode();
}

lightModeToggle.addEventListener('click', () => {
  lightMode = localStorage.getItem('lightMode'); 
  
  if (lightMode !== 'enabled') {
    enableLightMode();
    imgSrc.src = './images/icon-moon.svg';
  } else {  
    disableLightMode();
    imgSrc.src = './images/icon-sun.svg';
  }
});



// Task Complete check function
function checkboxClicked(index) {
    let getLocalStorageData = localStorage.getItem("New Todo");
    listArray = JSON.parse(getLocalStorageData);
    const element = document.getElementById("checkbox_"+index);
    const liChecked = document.getElementById("list_li_"+index);
    const fulllist = document.getElementById("list_"+index);
    if(element.classList.contains('checkbox')) {
        element.classList.add("checkbox-completed");
        element.classList.remove("checkbox");
        liChecked.classList.add("completed");
        liChecked.style.opacity = '0.3';
        fulllist.setAttribute('data-complete' , 'true');
        listArray[index].completed = true;
        localStorage.setItem("New Todo", JSON.stringify(listArray));
    }else{  
        element.classList.remove("checkbox-completed");
        element.classList.add("checkbox");
        liChecked.classList.remove("completed");
        fulllist.setAttribute('data-complete', 'false');
        listArray[index].completed = false;
        localStorage.setItem("New Todo", JSON.stringify(listArray));
        if(lightMode === 'enabled'){
          liChecked.style.opacity = .7;
        }
        else{
          liChecked.style.opacity = 1;
        }
    }
    checkTaskRemaining();
}



const textbox = document.getElementById("input_field");
textbox.addEventListener("keypress", function onEvent(event) {
   if(textbox.value != ''){
     if (event.key === "Enter") {
         document.getElementById("addbtn").click();
         document.getElementById('input_field').value = "";
     }
   }
});




function addTask(){
  const taskdata = document.getElementById('input_field').value;
  let getLocalStorageData = localStorage.getItem("New Todo");
  const dataobj = {value:taskdata,completed:false};
  if(getLocalStorageData == null){
    listArray = []; 
  }else{
    listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
  }
  listArray.push(dataobj); 
  localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string

  showTasks();
}


function showTasks(){
  const todoList = document.querySelector(".task_list");

  let getLocalStorageData = localStorage.getItem("New Todo");
  if(getLocalStorageData == null){
    listArray = [];
  }else{
    listArray = JSON.parse(getLocalStorageData); 
  }

  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += listItems(element,index);
  });
  todoList.innerHTML = newLiTag;
  checkTaskRemaining();
}

function listItems(element, index){
  if(element.completed){
    return `<li class="task_list_li ui-state-default" draggable="true" id="list_${index}" data-complete="${element.completed}">
        <div class="checkbox-completed" id="checkbox_${index}" onclick="checkboxClicked(${index})">
        </div>
        <div class="list_text completed" id="list_li_${index}" style="opacity:0.3;">
          <p>${element.value}</p>
        </div>
        <img src="images/icon-cross.svg" alt="delete task" onclick="deleteTask(${index})" class="submit_btn">
      </li>`;
  }
  else{
    return `<li class="task_list_li ui-state-default" draggable="true" id="list_${index}" data-complete="${element.completed}">
        <div class="checkbox" id="checkbox_${index}" onclick="checkboxClicked(${index})">
        </div>
        <div class="list_text" id="list_li_${index}">
          <p>${element.value}</p>
        </div>
        <img src="images/icon-cross.svg" alt="delete task" onclick="deleteTask(${index})" class="submit_btn">
      </li>`;
  }
}

function checkTaskRemaining(){
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  const selectCompleted = document.querySelectorAll('[data-complete="true"]').length;
  pendingTasksNumb.textContent = (listArray.length - selectCompleted) + " items left";
}

// delete task function
function deleteTask(index){
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1); //delete or remove the li
  localStorage.setItem("New Todo", JSON.stringify(listArray));
  showTasks(); 
}

// delete all completed tasks function
function Clear_completed_tasks(){
  let getLocalStorageData = localStorage.getItem("New Todo"); 
  if(getLocalStorageData == null){ 
    listArray = []; 
  }else{
    listArray = JSON.parse(getLocalStorageData);
    for(let i=0;i<listArray.length;i++){
      if(listArray[i].completed === true){
       listArray.splice(i,1);
       i--;
      }
    }
    localStorage.setItem("New Todo", JSON.stringify(listArray));
  }
  showTasks(); 
}

function filter_status(val){
  let submit_btn_all = document.getElementById("status_all");
  let submit_btn_active = document.getElementById("status_active");
  let submit_btn_completed = document.getElementById("status_completed");
  submit_btn_active.classList.remove('active');
  submit_btn_all.classList.remove('active');
  submit_btn_completed.classList.remove('active');
  let getLocalStorageData = localStorage.getItem("New Todo");
  listArray = JSON.parse(getLocalStorageData);
  if(getLocalStorageData == null){
    listArray = [];
  }
  else{ 
    if(val === 'active'){
      showTasks();
      let listitemToHide = document.querySelectorAll("[data-complete='true']");
        for (var i=0;i<listitemToHide.length;i+=1){
          listitemToHide[i].style.display = 'none';
        }

        for(let i=0;i<listArray.length;i++){
          if(listArray[i].completed === false){
            listItems(listArray[i], i);
          }
        }
        submit_btn_active.classList.add('active');
    }else if(val === 'completed'){
        showTasks();
        let listitemToHide = document.querySelectorAll("[data-complete='false']");
        for (var i=0;i<listitemToHide.length;i+=1){
          listitemToHide[i].style.display = 'none';
        }

        for(let i=0;i<listArray.length;i++){
          if(listArray[i].completed === true){
            listItems(listArray[i], i);
          }
        }
        submit_btn_completed.classList.add('active');
    }
    else{
      showTasks();
      submit_btn_all.classList.add('active');
    }
  }
}




//draggable code starts here
// const draggables = document.querySelectorAll('.draggable')
// const ulcontainer = document.querySelectorAll('.task_list')

// draggables.forEach(draggable => {
//   draggable.addEventListener('dragstart', () => {
//     draggable.classList.add('dragging')
//   })

//   draggable.addEventListener('dragend', () => {
//     draggable.classList.remove('dragging')
//   })
// })

// ulcontainer.forEach(container => {
//   container.addEventListener('dragover', e => {
//     e.preventDefault()
//     const afterElement = getDragAfterElement(container, e.clientY)
//     const draggable = document.querySelector('.dragging')
//     if (afterElement == null) {
//       container.appendChild(draggable)
//     } else {
//       container.insertBefore(draggable, afterElement)
//     }
//   })
// })

// function getDragAfterElement(container, y) {
//   const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

//   return draggableElements.reduce((closest, child) => {
//     const box = child.getBoundingClientRect()
//     const offset = y - box.top - box.height / 2
//     if (offset < 0 && offset > closest.offset) {
//       return { offset: offset, element: child }
//     } else {
//       return closest
//     }
//   }, { offset: Number.NEGATIVE_INFINITY }).element
// }