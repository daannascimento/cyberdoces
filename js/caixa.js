/* ==========================================================
   CAIXA
========================================================== */

let grafico = null;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

    await verificarLogin();

    await carregarDados();

}

/* ========================================================== */

async function carregarDados() {

    const { data, error } =
        await CaixaService.listar();

    if (error) {

        console.error(error);

        toast("Erro ao carregar movimentações.");

        return;

    }

    atualizarCards(data);

    atualizarTabela(data);

    atualizarGrafico(data);

}

/* ========================================================== */

async function salvarMovimentacao() {

    const tipo =
        byId("tipo").value;

    const categoria =
        byId("categoria").value;

    const descricao =
        byId("descricao").value;

    const formaPagamento =
        byId("formaPagamento").value;

    const valor =
        Number(byId("valor").value);

    if (!valor || valor <= 0) {

        toast("Informe um valor válido.");

        return;

    }

    const { error } =
        await CaixaService.inserir({

            tipo,

            categoria,

            descricao,

            forma_pagamento: formaPagamento,

            valor

        });

    if (error) {

        console.error(error);

        toast("Erro ao salvar movimentação.");

        return;

    }

    toast("Movimentação registrada!");

    limparFormulario();

    await carregarDados();

}

/* ========================================================== */

function limparFormulario() {

    byId("tipo").value = "entrada";

    byId("categoria").value = "";

    byId("descricao").value = "";

    byId("formaPagamento").value = "pix";

    byId("valor").value = "";

}

/* ========================================================== */

function atualizarCards(data) {

    let entradas = 0;

    let saidas = 0;

    data.forEach(item => {

        if (item.tipo === "entrada") {

            entradas += Number(item.valor);

        } else {

            saidas += Number(item.valor);

        }

    });

    byId("totalEntradas").innerHTML =
        moeda(entradas);

    byId("totalSaidas").innerHTML =
        moeda(saidas);

    byId("saldoAtual").innerHTML =
        moeda(entradas - saidas);

}

/* ========================================================== */

function atualizarTabela(data) {

    const tabela =
        byId("tabelaMovimentacoes");

    tabela.innerHTML = "";

    data.forEach(item => {

        tabela.innerHTML += `

        <tr>

            <td>${item.tipo}</td>

            <td>${item.categoria || ""}</td>

            <td>${item.descricao || ""}</td>

            <td>${item.forma_pagamento || ""}</td>

            <td>${moeda(item.valor)}</td>

            <td>${dataBR(item.created_at)}</td>

        </tr>

        `;

    });

}

/* ========================================================== */

function atualizarGrafico(data) {

    let entradas = 0;

    let saidas = 0;

    data.forEach(item => {

        if (item.tipo === "entrada") {

            entradas += Number(item.valor);

        } else {

            saidas += Number(item.valor);

        }

    });

    if (grafico) {

        grafico.destroy();

    }

    grafico = criarBarra(

        byId("grafico"),

        [

            "Entradas",

            "Saídas",

            "Saldo"

        ],

        [

            entradas,

            saidas,

            entradas - saidas

        ]

    );

}