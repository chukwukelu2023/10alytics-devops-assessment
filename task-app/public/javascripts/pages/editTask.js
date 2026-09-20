
const createtask = document.getElementById('editTaskForm')

createtask.addEventListener('submit',(e)=>{
    e.preventDefault()

    let id = document.getElementById('id')
    let title = document.getElementById('title')
    let description = document.getElementById('description')
    let status = document.getElementById('status')

    const formBody = {
            title:title.value,
            description:description.value,
            status:status.value
        }

    const jsonForm = JSON.stringify(formBody)
    let token = localStorage.getItem('token')
    fetch(`/tasks/update/${id.value}`,{
            method:'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "authorization":`Bearer ${token}`

            },
            body: jsonForm
        }).then(response => response.json())
        .then(data=> {
            alert(data.message)
          redirect()
        })
        .catch((error)=> {
            alert(error.message)
        })
    
        id.value="";
        title.value = "";
        description.value = "";
        status.value="PENDING"
})

function redirect(){
    location.href="./users.html"
}