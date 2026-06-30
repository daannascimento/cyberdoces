/* ==========================================================
   PARCELAS
========================================================== */

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

    await verificarLogin();

    await carregarParcelas();

}

/* ========================================================== */

async function carregarParcelas() {

    const { data, error } =
        await GastoService.listar();

    if (error) {

        console.error(error);

        toast("Erro ao carregar parcelas.");

        return;

    }

    let gastos = [...data];

    const pessoa =
        byId("filtroPessoa").value;

    const status =
        byId("filtroStatus").value;

    if (pessoa) {

        gastos =
            gastos.filter(g =>
                g.pessoa === pessoa
            );

    }

    if (status === "aberto") {

        gastos =
            gastos.filter(g => !g.quitado);

    }

    if (status === "quitado") {

        gastos =
            gastos.filter(g => g.quitado);

    }

    atualizarCards(gastos);

    atualizarPrevisao(gastos);

    atualizarTabela(gastos);

}

/* ========================================================== */

function atualizarCards(gastos) {

    let proximoFechamento = 0;

    let dividaParcelada = 0;

    let gastosVista = 0;

    gastos.forEach(g => {

        const parcelas =
            g.parcelas || 1;

        const parcelaAtual =
            g.parcela_atual || 1;

        const valorParcela =
            Number(
                g.valor_parcela ||
                (g.valor / parcelas)
            );

        if (g.quitado)
            return;

        if (parcelas > 1) {

            proximoFechamento +=
                valorParcela;

            const restantes =
                parcelas -
                parcelaAtual + 1;

            dividaParcelada +=
                restantes *
                valorParcela;

        }
        else {

            gastosVista +=
                Number(g.valor);

        }

    });

    byId("proximoFechamento").innerHTML =
        moeda(proximoFechamento);

    byId("dividaParcelada").innerHTML =
        moeda(dividaParcelada);

    byId("gastosVista").innerHTML =
        moeda(gastosVista);

    byId("totalDevido").innerHTML =
        moeda(
            dividaParcelada +
            gastosVista
        );

}

/* ========================================================== */

function atualizarPrevisao(gastos) {

    const tabela =
        byId("tabelaPrevisao");

    tabela.innerHTML = "";

    const previsao = {};

    gastos.forEach(g => {

        if (g.quitado)
            return;

        const parcelas =
            g.parcelas || 1;

        const atual =
            g.parcela_atual || 1;

        const valor =
            Number(
                g.valor_parcela ||
                (g.valor / parcelas)
            );

        const restantes =
            parcelas - atual + 1;

        if (parcelas === 1) {

            const chave =
                mesAno(new Date());

            previsao[chave] =
                (previsao[chave] || 0) +
                Number(g.valor);

            return;

        }

        for (let i = 0; i < restantes; i++) {

            const data =
                new Date();

            data.setMonth(
                data.getMonth() + i
            );

            const chave =
                mesAno(data);

            previsao[chave] =
                (previsao[chave] || 0) +
                valor;

        }

    });

    Object.entries(previsao)
        .forEach(([mes, total]) => {

            tabela.innerHTML += `

        <tr>

            <td>${mes}</td>

            <td>${moeda(total)}</td>

        </tr>

        `;

        });

}

/* ========================================================== */

function atualizarTabela(gastos) {

    const tabela =
        byId("tabelaParcelas");

    tabela.innerHTML = "";

    gastos.forEach(g => {

        const parcelas =
            g.parcelas || 1;

        const valorParcela =
            Number(
                g.valor_parcela ||
                (g.valor / parcelas)
            );

        tabela.innerHTML += `

        <tr>

            <td>${g.descricao || ""}</td>

            <td>${g.pessoa}</td>

            <td>${moeda(g.valor)}</td>

            <td>

                ${g.parcela_atual || 1}/${parcelas}

            </td>

            <td>

                ${moeda(valorParcela)}

            </td>

            <td>

                ${g.quitado
                ? "Quitado"
                : "Aberto"}

            </td>

            <td>

                ${g.quitado
                ? "-"
                :
                `<button onclick="avancarParcela('${g.id}')">

                        Próxima

                    </button>`
            }

            </td>

        </tr>

        `;

    });

}

/* ========================================================== */

async function avancarParcela(id) {

    const { data } =
        await GastoService.buscar(id);

    const parcelas =
        data.parcelas || 1;

    const valorParcela =
        Number(
            data.valor_parcela ||
            (data.valor / parcelas)
        );

    await CaixaService.inserir({

        tipo: "saida",

        categoria: "parcelas",

        descricao: data.descricao,

        valor: valorParcela,

        forma_pagamento: "credito"

    });

    let atual = data.parcela_atual || 1;
    let quitado = false;

    if (atual < parcelas) {

        // Avança para a próxima parcela
        atual++;

    } else {

        // Estava na última parcela e ela acabou de ser paga
        quitado = true;

    }

    await GastoService.atualizar(id, {

        parcela_atual: atual,

        quitado

    });

    toast("Parcela atualizada!");

    carregarParcelas();

}

/* ========================================================== */

function mesAno(data) {

    return data.toLocaleString(

        "pt-BR",

        {

            month: "long",

            year: "numeric"

        }

    );

}