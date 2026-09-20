
let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit",  (e) => {
  e.preventDefault();

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (email.value == "" || password.value == "") {
    alert("Ensure you input a value in both fields!");
  } else {
    const formBody = {
        email:email.value,
        password:password.value
    }
    const jsonForm = JSON.stringify(formBody)
    // perform operation with form input
    fetch("/users/login",{
        method:'POST',
        headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
        body: jsonForm
    }).then(response => response.json())
    .then(data=> {
      localStorage.setItem("token", data.token)
      redirect()
    })
    .catch((error)=> {
      alert(error.message)
    })

    email.value = "";
    password.value = "";
  }
});

function redirect(){
  location.href="./users.html";
}

