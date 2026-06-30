document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

  preencherFiltros();

  await carregarVendas();

  byId("filtroAno")
    .addEventListener("change", carregarVendas);

  byId("filtroMes")
    .addEventListener("change", carregarVendas);

}

function preencherFiltros() {

  const ano =
    byId("filtroAno");

  const mes =
    byId("filtroMes");

  const hoje =
    new Date();

  for (let a = 2025; a <= 2030; a++) {

    ano.innerHTML +=
      `<option value="${a}"

            ${a === hoje.getFullYear() ? "selected" : ""}

        >

            ${a}

        </option>`;

  }

  const meses = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

  ];

  meses.forEach((m, i) => {

    mes.innerHTML +=

      `<option value="${i + 1}"

            ${i === hoje.getMonth() ? "selected" : ""}

        >

            ${m}

        </option>`;

  });

}

async function carregarVendas() {

  const { data, error } = await client
    .from('vendas_resumo')
    .select('*')
    .order('data_venda', { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  atualizarCards(data);
  atualizarTabela(data);

  const ano =
    Number(byId("filtroAno").value);

  const mes =
    Number(byId("filtroMes").value);

  const filtrado = data.filter(item => {

    const partes = item.data_venda.split("-");

    const anoVenda = Number(partes[0]);

    const mesVenda = Number(partes[1]);

    return (

      anoVenda === ano &&

      mesVenda === mes

    );

  });

  atualizarCards(filtrado);

  atualizarTabela(filtrado);

}

function atualizarCards(data) {

  if (data.length === 0) return;

  const hoje = data[0];

  const faturamentoHoje =
    Number(hoje.valor_bruto || 0);

  const vendasHoje =
    Number(hoje.quantidade_vendas || 0);

  const ticket =
    vendasHoje > 0
      ? faturamentoHoje / vendasHoje
      : 0;

  const faturamentoMes =
    data.reduce((total, item) =>
      total + Number(item.valor_bruto || 0), 0);

  document.getElementById('faturamentoHoje').innerText =
    'R$ ' + faturamentoHoje.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2
      }
    );

  document.getElementById('vendasHoje').innerText =
    vendasHoje;

  document.getElementById('ticketMedio').innerText =
    'R$ ' + ticket.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2
      }
    );

  document.getElementById('faturamentoMes').innerText =
    'R$ ' + faturamentoMes.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2
      }
    );

}

function atualizarTabela(data) {

  const tabela =
    document.getElementById('tabelaVendas');

  tabela.innerHTML = '';

  data.forEach(item => {

    const ticket =
      Number(item.quantidade_vendas) > 0
        ? Number(item.valor_bruto) /
        Number(item.quantidade_vendas)
        : 0;

    tabela.innerHTML += `
      <tr>

        <td>
          ${item.data_venda
        ? item.data_venda.split('-').reverse().join('/')
        : ''}
        </td>

        <td>
          ${item.quantidade_vendas}
        </td>

        <td>
          R$ ${Number(item.valor_bruto)
        .toLocaleString(
          'pt-BR',
          {
            minimumFractionDigits: 2
          }
        )}
        </td>

        <td>
          R$ ${ticket.toLocaleString(
          'pt-BR',
          {
            minimumFractionDigits: 2
          }
        )}
        </td>

      </tr>
    `;

  });

}

carregarVendas();