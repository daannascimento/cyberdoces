/* ==========================================
   DASHBOARD
========================================== */

async function carregarDashboard(){

    await carregarKPIs();

    await carregarGraficoVendas();

    await carregarCategorias();

    await carregarProdutos();

    await carregarHorarios();

}

async function carregarKPIs(){}

async function carregarGraficoVendas(){}

async function carregarCategorias(){}

async function carregarProdutos(){}

async function carregarHorarios(){}

document.addEventListener(

"DOMContentLoaded",

async()=>{

    await verificarLogin();

    carregarDashboard();

});