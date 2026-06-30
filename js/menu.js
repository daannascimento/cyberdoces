/* ==========================================================
   MENU
========================================================== */

document.addEventListener("DOMContentLoaded", montarLayout);

function montarLayout() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) return;

    const pagina =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

    sidebar.innerHTML = `

    <div class="logo">

        <button id="btnMenu">

            <i class="bi bi-list"></i>

        </button>

        <span>🍬 Loja Dan & Rafa</span>

    </div>

    <nav>

        ${itemMenu("bi-speedometer2", "Dashboard", "bi", pagina)}

        ${itemMenu("bi-cart3", "Vendas", "vendas", pagina)}

        ${itemMenu("bi-wallet2", "Caixa", "caixa", pagina)}

        ${itemMenu("bi-credit-card", "Parcelas", "parcelas", pagina)}

        ${itemMenu("bi-cash-stack", "Gastos", "gastos", pagina)}

        ${itemMenu("bi-arrow-left-right", "Reembolsos", "reembolsos", pagina)}

    </nav>

    <div class="sidebar-footer">

    <button id="btnLogout">

        <i class="bi bi-box-arrow-right"></i>

        <span>Sair</span>

    </button>

    </div>

    `;

    document
        .getElementById("btnMenu")
        .addEventListener("click", toggleSidebar);

    document
        .getElementById("btnLogout")
        .addEventListener("click", logout);

    if (localStorage.getItem("sidebar") === "true") {

        document
            .getElementById("sidebar")
            .classList.add("collapsed");

        document
            .querySelector(".main")
            .classList.add("collapsed");

    }

    montarTopbar();
}

/* ===================================== */

function itemMenu(icone, texto, paginaAtual, pagina) {

    const ativo =
        paginaAtual === pagina
            ? "active"
            : "";

    return `

    <a
        href="${paginaAtual}.html"
        class="${ativo}">

        <i class="bi ${icone}"></i>

        <span>${texto}</span>

    </a>

    `;

}

/* ===================================== */

async function logout() {

    await client.auth.signOut();

    location.href = "login.html";

}



function montarTopbar() {

    const main = document.querySelector(".main");

    if (!main) return;

    if (document.querySelector(".topbar"))
        return;

    const topbar = document.createElement("div");

    topbar.innerHTML = `

    <div class="topbar-left">

        <h2>${document.title}</h2>

    </div>

    <div class="topbar-right">

        ${new Date().toLocaleDateString("pt-BR")}

    </div>

    `;

    main.prepend(topbar);


}

function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");

    if (!sidebar || !main)
        return;

    sidebar.classList.toggle("collapsed");
    main.classList.toggle("collapsed");

    localStorage.setItem(
        "sidebar",
        sidebar.classList.contains("collapsed")
    );

}