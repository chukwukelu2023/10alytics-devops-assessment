
window.addEventListener('load',getData)

function getData(){
    let token = localStorage.getItem('token')
    fetch("/users/current",{
        method:'GET',
        headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
      "authorization":`Bearer ${token}`
		},
    }).then(response => response.json())
    .then(data=> {
      loadFooterData(data.serverDetails)
        loadTableData(data.user)
    })
    .catch((error)=> {
      alert(error.message)
    })
}

function loadTableData(users){
    let taskTable = document.getElementById("taskData")
    let greetings = document.getElementById("greet")
    if(users.tasks.length < 1){
      taskActions.style.display="none"
    }
    let tableRows = ""
    for(let task of users.tasks){
        tableRows += `<tr >
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${formatDate(task.dateCreated)}</td>
        <td>${task.status}</td>
        <td> ${formatDate(task.dateCompleted )}</td>
        <td>
        </td>
  </tr>
`}
    let table = `<table >
    <tr>
      <th>Task ID</th>
      <th>Title</th>
      <th>Description</th>
      <th>Date Created</th>
      <th>Status</th>
      <th>Date Completed</th>
    </tr> 
    ${tableRows} 
  </table>
  `
const hour = new Date().getHours();
let welcomeText = "";

if (hour < 12) welcomeText = "Good Morning";
else if (hour < 18) welcomeText = "Good Afternoon";
else welcomeText = "Good Evening";

greetings.innerHTML = `<h1>${welcomeText} ${users.firstName} ${users.lastName}</h1>`
  let taskPage = `<div>${users.tasks.length < 1 ? '<h2>You currently don\'t have any tasks click <a href="/pages/tasks.html">here</a> to create a new task</h2>': table}</div>
`
    taskTable.innerHTML = taskPage
}

function formatDate(dateString){
  const time = new Date(dateString)
  const formatedDate = dateString ? `${time.getFullYear()}/${time.getMonth()}/${time.getDay()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}` : "NILL"
  return formatedDate

}

const taskToComplete = document.getElementById('completeTask')
const taskToDelete = document.getElementById('deleteTask')
const taskToEdit = document.getElementById('editTask')
const taskToCreate = document.getElementById('createTask')
const logOut = document.getElementById('signout')

taskToComplete.addEventListener('click',completeTask)
taskToDelete.addEventListener('click',deleteTask)
taskToCreate.addEventListener('click',createTask)
taskToEdit.addEventListener('click',editTask)
logOut.addEventListener('click',signOut)




function completeTask(){
  let taskId = prompt("Confirm by entering the Task Id")
  let token = localStorage.getItem('token')
  fetch(`/tasks/complete/${taskId}`,{
    method:'PUT',
    headers: {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "authorization":`Bearer ${token}`,
},
}).then(response => response.json())
.then(data=> {
  alert(data.message)
 redirect()
})
.catch((error)=> console.log("Error",error.message))
}


function deleteTask(){
  let taskId = prompt("Confirm by entering the Task Id")
  let token = localStorage.getItem('token')
  fetch(`/tasks/${taskId}`,{
    method:'DELETE',
    headers: {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "authorization":`Bearer ${token}`,
},
}).then(response => response.json())
.then(data=> {
  alert(data.message)
 redirect()
})
.catch((error)=> {
  alert(error.message)
})
}

function editTask(){
  redirectToEditTask()
}

function createTask(){
  redirectToTaskPage()
}
function signOut(){
  const response = prompt("Type YES to confirm thay you want to logout")
  if(response && response.toUpperCase() === "YES"){
    localStorage.removeItem('token')
    redirectToHomePage()
  }

}

function redirect(){
  location.href="./users.html";
}

function redirectToTaskPage(){
  location.href = "./tasks.html"
}

function redirectToEditTask(){
  location.href="./editTask.html"
}

function redirectToHomePage(){
  location.href="/index.html"
}

function loadFooterData(data){
  const footer = document.getElementById('footer')
  const footerData = `Server Name: <strong>${data.hostname}</strong>  Machine: <strong>${data.machine}</strong> OS Architecture: <strong>${data.osArch}</strong>  OS Type: <strong>${data.type}</strong> OS Release: <strong>${data.release}</strong>
    IP Address: <strong>${data.network.address}</strong> MAC Address: <strong>${data.network.mac}</strong> OS Version: <strong>${data.version}</strong>
  `
  footer.innerHTML=footerData
}
