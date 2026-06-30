document
    .getElementById("btnLogin")
    .addEventListener(
        "click",
        login
    );

async function login(){

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const erro =
        document.getElementById("erro");

    erro.innerHTML="";

    const {
        error
    } = await client.auth.signInWithPassword({

        email,

        password:senha

    });

    if(error){

        erro.innerHTML =
            "Usuário ou senha inválidos.";

        return;

    }

    location.href="bi.html";

}