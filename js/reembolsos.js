/* ==========================================================
   REEMBOLSSOS
========================================================== */

let grafico = null;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar(){

    await verificarLogin();

    await carregarDados();

}

/* ========================================================== */

async function carregarDados(){

    const { data: gastos, error: erroGastos } =
        await GastoService.listar();

    const { data: reembolsos, error: erroReembolsos } =
        await ReembolsoService.listar();

    if (erroGastos || erroReembolsos) {

        console.error(erroGastos || erroReembolsos);

        return;

    }

    atualizarCards(gastos,reembolsos);

    atualizarTabela(reembolsos);

    atualizarGrafico(gastos,reembolsos);

}

/* ========================================================== */

async function registrarPagamento(){

    const pessoa =
        byId("pessoa").value;

    const valor =
        Number(byId("valor").value);

    const descricao =
        byId("descricao").value;

    if(valor<=0){

        toast("Informe um valor.");

        return;

    }

    const { error } =
        await ReembolsoService.inserir({

            pessoa,

            valor,

            descricao

        });

    if(error){

        console.error(error);

        toast("Erro ao registrar.");

        return;

    }

    toast("Pagamento registrado!");

    byId("valor").value="";

    byId("descricao").value="";

    carregarDados();

}

/* ========================================================== */

function atualizarCards(gastos,reembolsos){

    const totalInvestido =
        gastos.reduce(
            (t,g)=>t+Number(g.valor),
            0
        );

    const totalReembolsado =
        reembolsos.reduce(
            (t,r)=>t+Number(r.valor),
            0
        );

    byId("totalInvestido").innerHTML =
        moeda(totalInvestido);

    byId("totalReembolsado").innerHTML =
        moeda(totalReembolsado);

    byId("saldoPendente").innerHTML =
        moeda(
            totalInvestido -
            totalReembolsado
        );

}

/* ========================================================== */

function atualizarTabela(reembolsos){

    const tabela =
        byId("tabelaReembolsos");

    tabela.innerHTML="";

    reembolsos.forEach(item=>{

        tabela.innerHTML += `

        <tr>

            <td>${item.pessoa}</td>

            <td>${moeda(item.valor)}</td>

            <td>${item.descricao||""}</td>

            <td>${dataBR(item.created_at)}</td>

        </tr>

        `;

    });

}

/* ========================================================== */

function atualizarGrafico(gastos,reembolsos){

    let totalDan=0;
    let totalRafa=0;

    let recebidoDan=0;
    let recebidoRafa=0;

    gastos.forEach(g=>{

        if(g.pessoa==="Dan")
            totalDan+=Number(g.valor);

        if(g.pessoa==="Rafa")
            totalRafa+=Number(g.valor);

    });

    reembolsos.forEach(r=>{

        if(r.pessoa==="Dan")
            recebidoDan+=Number(r.valor);

        if(r.pessoa==="Rafa")
            recebidoRafa+=Number(r.valor);

    });

    const saldoDan =
        totalDan -
        recebidoDan;

    const saldoRafa =
        totalRafa -
        recebidoRafa;

    if(grafico){

        grafico.destroy();

    }

    grafico = criarBarra(

        byId("grafico"),

        [

            "Dan Investido",

            "Dan Recebido",

            "Dan Saldo",

            "Rafa Investido",

            "Rafa Recebido",

            "Rafa Saldo"

        ],

        [

            totalDan,

            recebidoDan,

            saldoDan,

            totalRafa,

            recebidoRafa,

            saldoRafa

        ]

    );

}