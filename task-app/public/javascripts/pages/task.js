
const createtask = document.getElementById('createTaskForm')

createtask.addEventListener('submit',(e)=>{
    e.preventDefault()

    let title = document.getElementById('title')
    let description = document.getElementById('description')

    if(title.value == ""){
        alert("Please Fill in the Title")
    }else{
        const formBody ={
            title: title.value,
            description: description.value
        }

        const jsonForm = JSON.stringify(formBody)
        let token = localStorage.getItem('token')
        fetch("/tasks",{
            method:'POST',
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
    
        title.value = "";
        description.value = "";
    }
})

function redirect(){
    location.href="./users.html"
}