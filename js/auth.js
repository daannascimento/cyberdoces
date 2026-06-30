/* ==========================================
   AUTENTICAÇÃO
========================================== */

async function verificarLogin(){

    const {

        data:{session}

    } = await client.auth.getSession();

    if(!session){

        location.href="login.html";

    }

}

async function usuarioAtual() {

    const {
        data: { user }
    } = await client.auth.getUser();

    return user;

}

async function logout() {

    await client.auth.signOut();

    window.location.href =
        "../login.html";

}