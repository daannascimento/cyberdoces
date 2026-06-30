/* ==========================================================
   BUSINESS INTELLIGENCE
========================================================== */

document.addEventListener("DOMContentLoaded", iniciar);

let chartReceita = null;
let chartHora = null;
let chartCategoria = null;
let chartPagamento = null;

let dadosBI = null;

/* ========================================================== */

async function iniciar() {

    await verificarLogin();

    document
        .getElementById("btnAtualizar")
        .addEventListener("click", carregarBI);

    await carregarBI();

}

/* ========================================================== */

async function carregarBI() {

    try {

        dadosBI =
            await DashboardService.getBI();

        console.log("BI", dadosBI);

        preencherFiltros();

        atualizarKPIs();

        atualizarTabelaTop();

        atualizarTabelaBaixoGiro();
/*
        desenharReceita();

        desenharHora();

        desenharCategoria();

        desenharPagamento();
*/
    }
    catch (e) {

        console.error(e);

        toast("Erro ao carregar BI.");

    }

}

/* ==========================================================
   KPIs
========================================================== */

function atualizarKPIs() {

    let receita = 0;

    let vendas = 0;

    let custo = 0;

    let itens = 0;

    dadosBI.resumo.forEach(r => {

        receita += Number(r.valor_bruto);

        vendas += Number(r.quantidade_vendas);

    });

    dadosBI.produtos.forEach(p => {

        custo += Number(p.custo);

        itens += Number(p.quantidade);

    });

    const ticket =
        vendas > 0
        ? receita / vendas
        : 0;

    const lucro =
        receita - custo;

    const margem =
        receita > 0
        ? (lucro / receita) * 100
        : 0;

    byId("kpiReceita").innerHTML =
        moeda(receita);

    byId("kpiVendas").innerHTML =
        vendas.toLocaleString("pt-BR");

    byId("kpiTicket").innerHTML =
        moeda(ticket);

    byId("kpiLucro").innerHTML =
        moeda(lucro);

    byId("kpiMargem").innerHTML =
        margem.toFixed(1) + "%";

    byId("kpiProdutos").innerHTML =
        itens.toLocaleString("pt-BR");

}

/* ==========================================================
   FILTROS
========================================================== */

function preencherFiltros(){

    const categoria =
        byId("categoria");

    const produto =
        byId("produto");

    categoria.innerHTML =
        "<option value=''>Todas</option>";

    produto.innerHTML =
        "<option value=''>Todos</option>";

    [...new Set(

        dadosBI.categorias.map(c=>c.categoria)

    )]

    .sort()

    .forEach(item=>{

        categoria.innerHTML +=

        `<option>

            ${item}

        </option>`;

    });

    [...new Set(

        dadosBI.produtos.map(p=>p.descricao)

    )]

    .sort()

    .forEach(item=>{

        produto.innerHTML +=

        `<option>

            ${item}

        </option>`;

    });

}

/* ==========================================================
   TOP PRODUTOS
========================================================== */

function atualizarTabelaTop(){

    const tabela =
        byId("topProdutos");

    tabela.innerHTML = "";

    [...dadosBI.produtos]

    .sort(

        (a,b)=>

            Number(b.valor_bruto) -

            Number(a.valor_bruto)

    )

    .slice(0,10)

    .forEach(item=>{

        tabela.innerHTML += `

        <tr>

            <td>${item.descricao}</td>

            <td>${Number(item.quantidade)}</td>

            <td>${moeda(item.valor_bruto)}</td>

            <td>${moeda(item.custo)}</td>

        </tr>

        `;

    });

}

/* ==========================================================
   BAIXO GIRO
========================================================== */

function atualizarTabelaBaixoGiro(){

    const tabela =
        byId("baixoGiro");

    tabela.innerHTML="";

    [...dadosBI.produtos]

    .sort(

        (a,b)=>

            Number(a.quantidade)-

            Number(b.quantidade)

    )

    .slice(0,10)

    .forEach(item=>{

        tabela.innerHTML +=`

        <tr>

            <td>${item.descricao}</td>

            <td>${Number(item.quantidade)}</td>

            <td>${moeda(item.valor_bruto)}</td>

        </tr>

        `;

    });

}

/* ==========================================================
   RECEITA POR DIA
========================================================== */

/* ==========================================================
   RECEITA ÚLTIMOS 30 DIAS
========================================================== */

function desenharReceita() {

    const labels = [];
    const valores = [];

    const ultimos30 = [...dadosBI.resumo]

        .sort((a, b) =>
            new Date(a.data_venda) -
            new Date(b.data_venda)
        )

        .slice(-30);

    ultimos30.forEach(item => {

        labels.push(dataBR(item.data_venda));

        valores.push(Number(item.valor_bruto));

    });

    if (chartReceita)
        chartReceita.destroy();

    chartReceita = new Chart(

        byId("graficoReceita"),

        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label: "Receita",

                        data: valores,

                        tension: .35,

                        fill: true

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}
/* ==========================================================
   VENDAS POR HORA
========================================================== */

/* ==========================================================
   HORÁRIO DE PICO
========================================================== */

function desenharHora() {

    const mapa = {};

    dadosBI.horarios.forEach(item => {

        const hora =
            Number(item.hora);

        if (!mapa[hora]) {

            mapa[hora] = 0;

        }

        mapa[hora] +=
            Number(item.valor_bruto);

    });

    const labels = [];
    const valores = [];

    Object.keys(mapa)

        .sort((a,b)=>a-b)

        .forEach(hora=>{

            labels.push(hora + ":00");

            valores.push(mapa[hora]);

        });

    if(chartHora)
        chartHora.destroy();

    chartHora = new Chart(

        byId("graficoHora"),

        {

            type:"bar",

            data:{

                labels,

                datasets:[{

                    label:"Receita",

                    data:valores

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:false
                    }

                }

            }

        }

    );

}
/* ==========================================================
   CATEGORIAS
========================================================== */

function desenharCategoria(){

    const labels=[];
    const valores=[];

    dadosBI.categorias.forEach(item=>{

        labels.push(item.categoria);

        valores.push(Number(item.valor_bruto));

    });

    if(chartCategoria){

        chartCategoria.destroy();

    }

    chartCategoria = new Chart(

        byId("graficoCategoria"),

        {

            type:"doughnut",

            data:{

                labels,

                datasets:[{

                    data:valores

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ==========================================================
   PAGAMENTOS
========================================================== */

function desenharPagamento(){

    let pix=0;
    let cartao=0;
    let dinheiro=0;

    dadosBI.resumo.forEach(item=>{

        pix += Number(item.valor_pix);

        cartao += Number(item.valor_cartao);

        dinheiro += Number(item.valor_dinheiro);

    });

    if(chartPagamento){

        chartPagamento.destroy();

    }

    chartPagamento = new Chart(

        byId("graficoPagamento"),

        {

            type:"pie",

            data:{

                labels:[

                    "PIX",

                    "Cartão",

                    "Dinheiro"

                ],

                datasets:[{

                    data:[

                        pix,

                        cartao,

                        dinheiro

                    ]

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ==========================================================
   CONTINUA...
========================================================== */