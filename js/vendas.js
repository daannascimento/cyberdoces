

async function carregarVendas(){

  const { data, error } = await client
    .from('vendas_resumo')
    .select('*')
    .order('data_venda', { ascending:false });

  if(error){
    console.log(error);
    return;
  }

  atualizarCards(data);
  atualizarTabela(data);

}

function atualizarCards(data){

  if(data.length === 0) return;

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
    data.reduce((total,item) =>
      total + Number(item.valor_bruto || 0),0);

  document.getElementById('faturamentoHoje').innerText =
    'R$ ' + faturamentoHoje.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:2
      }
    );

  document.getElementById('vendasHoje').innerText =
    vendasHoje;

  document.getElementById('ticketMedio').innerText =
    'R$ ' + ticket.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:2
      }
    );

  document.getElementById('faturamentoMes').innerText =
    'R$ ' + faturamentoMes.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits:2
      }
    );

}

function atualizarTabela(data){

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
                minimumFractionDigits:2
              }
            )}
        </td>

        <td>
          R$ ${ticket.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits:2
            }
          )}
        </td>

      </tr>
    `;

  });

}

carregarVendas();