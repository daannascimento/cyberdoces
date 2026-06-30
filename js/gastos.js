/* ==========================================================
   GASTOS
========================================================== */

let grafico = null;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

    await verificarLogin();

    await carregarDados();

}

async function carregarDados() {

    const { data, error } = await GastoService.listar();

    if (error) {

        console.error(error);
        toast("Erro ao carregar gastos.");

        return;

    }

    atualizarTabela(data);
    atualizarGrafico(data);

}

async function salvar() {

    const valor = Number(byId("valor").value);

    const pessoa = byId("pessoa").value;

    const categoria = byId("categoria").value;

    const descricao = byId("descricao").value;

    const parcelas = Number(byId("parcelas").value || 1);

    if (!valor || valor <= 0) {

        toast("Informe um valor válido.");

        return;

    }

    const gasto = {

        valor,

        pessoa,

        categoria,

        descricao,

        parcelas,

        parcela_atual: 1,

        valor_parcela: valor / parcelas,

        quitado: false

    };

    const { error } = await GastoService.inserir(gasto);

    if (error) {

        console.error(error);

        toast("Erro ao salvar gasto.");

        return;

    }

    toast("Gasto salvo com sucesso!");

    limparFormulario();

    carregarDados();

}

function limparFormulario() {

    byId("valor").value = "";

    byId("categoria").value = "";

    byId("descricao").value = "";

    byId("parcelas").value = 1;

}

function atualizarTabela(data) {

    const tabela = byId("tabelaGastos");

    tabela.innerHTML = "";

    data.forEach(gasto => {

        tabela.innerHTML += `

        <tr>

            <td>${moeda(gasto.valor)}</td>

            <td>${gasto.pessoa}</td>

            <td>${gasto.categoria}</td>

            <td>${gasto.descricao || ""}</td>

            <td>${gasto.parcelas || 1}x</td>

        </tr>

        `;

    });

}

function atualizarGrafico(data) {

    let dan = 0;

    let rafa = 0;

    data.forEach(gasto => {

        if (gasto.pessoa === "Dan") {

            dan += Number(gasto.valor);

        }

        if (gasto.pessoa === "Rafa") {

            rafa += Number(gasto.valor);

        }

    });

    const ctx = byId("grafico");

    if (grafico) {

        grafico.destroy();

    }

    grafico = criarPizza(

        ctx,

        ["Dan", "Rafa"],

        [dan, rafa]

    );

}