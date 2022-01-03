const ul = document.querySelector("ul")
const delAllBtn= document.querySelector("#todo-delall")
const form = document.querySelector("#todo-uinput")
const datePicker = document.querySelector('#todo-date')
let elstatus;

const filterInput = document.querySelector('#filterbytext')
let filteredText = ''

/*+++++++++++++ All events +++++++++++++++++ */

form.addEventListener('submit', e => {
    e.preventDefault();
    addTODO(document.getElementById('todo-text').value,  document.getElementById('todo-date').value);
    addToLocalStorage(todoArray)
})

delAllBtn.addEventListener('click', e => { delTODO(""); }) 



/*+++++++++++++ Start of Model +++++++++++++++++ */

//sample data

let todoArray = [
    { 
        id: "25262", 
        text: "Water the plants", 
        dueDate: "2022-01-02",
        todoStatus: false 
    },
    
    { 
        id: "25522", 
        text: "Feed Tina's cat", 
        dueDate: "2022-05-21",
        todoStatus: false 
    },
    
    { 
        id: "255622", 
        text: "Bake christmas cookies", 
        dueDate:"2021-12-01",
        todoStatus: true 
    }
];

// needed to switch between edit and static mode
let editMode = null

// +++++ Local storage function +++++ //
function addToLocalStorage(todoArray) {
    localStorage.setItem('todoArray', JSON.stringify(todoArray))
    // updateScreen()
}

function getLocalStorage() {
    const localTodos = localStorage.getItem('todoArray')
    if(localTodos) {
        todoArray = JSON.parse(localTodos)
        updateScreen()
    }
}
getLocalStorage()

/*   //  ++++++++Controller: will manipulate data given by user+++++++++ */
function addTODO(userInput, userDate){
    //Add date and improved ID
    
    if(userDate!= "") { 
        todoArray.unshift({ id: Date.now() * Math.floor(Math.random()*1000) + Math.floor(Math.random()*10000).toString(16).substring(1) , dueDate: userDate, text: userInput, todoStatus: false });
    }   else   {todoArray.unshift({ id: Date.now() * Math.floor(Math.random()*1000) + Math.floor(Math.random()*10000).toString(16).substring(1) , dueDate: "", text: userInput, todoStatus: false });}// updateScreen();
    datePicker.value = ''
    addToLocalStorage(todoArray)
    updateScreen()
}

// delete todos
function delTODO(todoID) {
    if(todoID == '') {
        if(confirm('Really delete all?')){
        todoArray=[];
    }
    }
    if (todoID !== "" && todoArray.filter(el => el.id == todoID).length === 0) {
        alert("Sorry item not found, Try again");//Should we be using a fucnction and call it?   
        // updateScreen();
        addToLocalStorage(todoArray)
    }
    else {
        todoArray = todoArray.filter(el => el.id != todoID);
        // updateScreen();
        addToLocalStorage(todoArray)
    }
    updateScreen()
}

// Edit function
function editTODO(todoID){
    // console.log('Edit button')
    if(todoID == editMode) {
        // console.log('no edit mode')
        const indexID = todoArray.findIndex(el => el.id == todoID)     
        const newText = document.querySelector('.todotext.edit').innerText;
        let updatedTodo = todoArray[indexID]
        updatedTodo.text = newText
        todoArray.splice(indexID, 1, updatedTodo)
        
        editMode = null
    } else {
        editMode = todoID
    }
    updateScreen() 
    addToLocalStorage(todoArray)
}
// Toggle status todo
function statusTODO(todoID) {
    // console.log(todoID)
    todoArray.forEach(el => {
        if(el.id == todoID) {
            el.todoStatus = !el.todoStatus
        }
    })
    document.querySelector(".todotext-"+todoID).classList.toggle("todo--done")
    document.querySelector(".check-"+todoID).classList.toggle("complete")
    updateScreen()
    addToLocalStorage(todoArray)
}

// Filter items total
const filterResults = (event) => {
    filteredText = event.target.value
    updateScreen()   
}
filterInput.addEventListener('keyup', filterResults)

/*+++++++++++++ Start of view part++++++++++++++++++ */

//update page
function updateScreen() {
    document.querySelector("#todo-text").value = "";


    
    // filter view // show todos by typing a search term into the second input field 
    let todos = todoArray.filter(todo => todo.text.toUpperCase().includes(filteredText.toUpperCase()))
    
    document.querySelector('#total').innerText = todoArray.length
    document.querySelector('#match').innerText = todos.length < todoArray.length ? todos.length : 0
    document.querySelector('#completed').innerText = todoArray.filter(todo => todo.todoStatus).length
    
    ul.innerHTML="";
    todoArray.forEach(el => {
        const today = new Date()
        const date = today.toISOString().slice(0,10)
        ul.innerHTML+= `
        <li class="todo selector-${el.id}" id="${el.id}">
        <span id="${el.id}" class="check check-${el.id} ${el.todoStatus ? "complete" : ""}"></span>
        
        ${el.id == editMode ? `<span id="${el.id}" class="todotext todotext-${el.id} edit" contenteditable> ${el.text}</span>` : `<span id="${el.id}" class="todotext todotext-${el.id} ${el.todoStatus ? "todo--done" : ""} ${el.dueDate < date ? 'due' : ''}"> ${el.text}<br><span class="todo--date ${el.dueDate < date ? 'due' : ''}">${el.dueDate}</span></span>`}
        
        ${el.id == editMode ? `<button class="todo-edit" id="${el.id}"><svg id="${el.id}" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Save</title><path d="M380.93 57.37A32 32 0 00358.3 48H94.22A46.21 46.21 0 0048 94.22v323.56A46.21 46.21 0 0094.22 464h323.56A46.36 46.36 0 00464 417.78V153.7a32 32 0 00-9.37-22.63zM256 416a64 64 0 1164-64 63.92 63.92 0 01-64 64zm48-224H112a16 16 0 01-16-16v-64a16 16 0 0116-16h192a16 16 0 0116 16v64a16 16 0 01-16 16z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></button>`: `<button class="todo-edit" id="${el.id}"><svg id="${el.id}" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Create</title><path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"/></svg></button>`}
        <button class="todo-del" id="${el.id}" ><svg id="${el.id}" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Trash</title><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></button> 
        </li>
        `
    });
    const delBtn = document.querySelectorAll(".todo-del")
    for (let i = 0; i < delBtn.length; i++) {
        delBtn[i].addEventListener('click', e => {delTODO(e.target.id);})
    }
    const editBtn = document.querySelectorAll('.todo-edit') 
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener('click', e => editTODO(e.target.id))
    }
    const checkBtn = document.querySelectorAll(".check")
    for (let i = 0; i < checkBtn.length; i++) {
        checkBtn[i].addEventListener('click', e => statusTODO(e.target.id))   
    }
    // Prevent paragraph breaks when task is editable
    let editableField = document.querySelector('.todotext.edit')
    if(editableField) {
        editableField.addEventListener('keypress', (e) => {
        if (e.which === 13) {
            e.preventDefault();
        }
    });
    }
}

updateScreen(); // for the first time loading of page