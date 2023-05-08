var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

var body = document.querySelector("body");

btnSignin.addEventListener("click", function () {
  body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
  body.className = "sign-up-js";
});


 const form = document.querySelector("#myForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const nameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const usernameInput = document.querySelector("#username");

form.addEventListener("submit", (event) => {
  // impede que o formulário seja enviado automaticamente
  event.preventDefault();

  if (!validateEmail(emailInput.value)) {
    alert("Por favor, insira um endereço de e-mail válido.");
    return;
  }

  if (passwordInput.value.trim().length <= 7) {
    alert("A senha deve ter pelo menos 8 caracteres.");
    return;
  }

  if (nameInput.value.trim() === "") {
    alert("Por favor, insira seu nome.");
    return;
  }

  if (lastNameInput.value.trim() === "") {
    alert("Por favor, insira seu sobrenome.");
    return;
  }

  if (usernameInput.value.trim().length <= 7) {
    alert("Por favor, insira um nome de usuário.");
    return;
  }

  // envie os dados para o back-end usando uma biblioteca como Axios
  axios.post("http://localhost:3333/users", {
    firstName: nameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
  })
    .then(() => {
      alert("Cadastro realizado com sucesso!");
    })
    .catch((error) => {
      alert("Ocorreu um erro ao cadastrar: " + error.message);
    });
});

const loginForm = document.querySelector("#loginForm");
const emailInputt = document.querySelector("#emaill");
const passwordInputt = document.querySelector("#passwordd");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateEmail(emailInputt.value)) {
    alert("Por favor, insira um endereço de e-mail válido.");
    return;
  }
  console.log(emailInputt.value);

  axios
    .post("http://localhost:3333/session", {
      user: emailInputt.value,
      password: passwordInputt.value,
    })
    .then((response) => {
      // fazer algo com a resposta, como armazenar o token de autenticação
      console.log(response.data);
      /*   alert("Login realizado com sucesso!"); */
      window.location.href = "login-teste.html";
    })
    .catch((error) => {
      alert("Ocorreu um erro ao fazer login: " + error.message),
        console.log(emailInput);
    });
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
