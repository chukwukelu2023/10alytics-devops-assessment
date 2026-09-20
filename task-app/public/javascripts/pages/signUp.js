let signUpForm = document.getElementById("signUpForm");

signUpForm.addEventListener("submit",  (e) => {
  e.preventDefault();

  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let repeatPassword = document.getElementById('repeatPassword')

  if (password.value !== repeatPassword.value) {
    alert("Passwords Did not Match");
  } else {
    const formBody = {
        firstName:firstName.value,
        lastName:lastName.value,
        email:email.value,
        password:password.value
    }
    const jsonForm = JSON.stringify(formBody)
    // perform operation with form input
    fetch("/users/register",{
        method:'POST',
        headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
        body: jsonForm
    }).then(response => {
        console.log("Response",response.status)
        if(response.status == 409){
            alert("User with the email already exists")
           return redirectToSamePage()
        }
        return response.json()
    })
    .then(data=> {
      alert(data.message)
      redirect()
    })
    .catch((error)=> {
        alert(error.message)
    })

    firstName.value=""
    lastName.value=""
    email.value = "";
    password.value = "";
  }
});

function redirect(){
  location.href="./login.html";
}

function redirectToSamePage(){
    location.href="./signup.html"
}

