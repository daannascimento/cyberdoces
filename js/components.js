/* ==========================================================
   COMPONENTS
   Loja Dan & Rafa
========================================================== */


/* ===========================
        KPI CARD
=========================== */

function criarKPI({
    titulo,
    valor,
    icone,
    cor = "icon-blue",
    subtitulo = ""
}){

    return `
    
    <div class="card">

        <div class="kpi-card">

            <div class="kpi-info">

                <span class="kpi-title">
                    ${titulo}
                </span>

                <span class="kpi-value">
                    ${valor}
                </span>

                <span class="kpi-subtitle">
                    ${subtitulo}
                </span>

            </div>

            <div class="kpi-icon ${cor}">
                ${icone}
            </div>

        </div>

    </div>

    `;

}


/* ===========================
      CARD PADRÃO
=========================== */

function criarCard({

    titulo,

    conteudo,

    classe = ""

}){

    return `

    <div class="card ${classe}">

        <div class="card-header">

            <h3>${titulo}</h3>

        </div>

        ${conteudo}

    </div>

    `;

}


/* ===========================
      ALERTAS
=========================== */

function criarAlerta({

    titulo,

    descricao,

    tipo = "success",

    icone = "ℹ️"

}){

    return `

    <div class="alert-card ${tipo}">

        <div class="alert-icon">

            ${icone}

        </div>

        <div class="alert-text">

            <div class="alert-title">

                ${titulo}

            </div>

            <div class="alert-description">

                ${descricao}

            </div>

        </div>

    </div>

    `;

}


/* ===========================
        BADGE
=========================== */

function criarBadge(texto, tipo = "success"){

    return `
        <span class="badge badge-${tipo}">
            ${texto}
        </span>
    `;

}


/* ===========================
        TABELA
=========================== */

function criarTabela(colunas, linhas){

    let html = `

        <div class="table-responsive">

        <table>

        <thead>

        <tr>

    `;

    colunas.forEach(coluna=>{

        html += `<th>${coluna}</th>`;

    });

    html += `

        </tr>

        </thead>

        <tbody>

    `;

    linhas.forEach(linha=>{

        html += "<tr>";

        linha.forEach(valor=>{

            html += `<td>${valor}</td>`;

        });

        html += "</tr>";

    });

    html += `

        </tbody>

        </table>

        </div>

    `;

    return html;

}


/* ===========================
      LOADING
=========================== */

function criarLoading(){

    return `

        <div style="text-align:center;padding:50px">

            <h3>Carregando...</h3>

        </div>

    `;

}


/* ===========================
      SEM DADOS
=========================== */

function criarSemDados(){

    return `

        <div style="text-align:center;padding:40px">

            Nenhuma informação encontrada.

        </div>

    `;

}


/* ===========================
      CONTAINER
=========================== */

function renderizar(id, html){

    document
        .getElementById(id)
        .innerHTML = html;

}

function criarPizza(canvas, labels, valores) {

    return new Chart(canvas, {

        type: "pie",

        data: {

            labels,

            datasets: [{

                data: valores

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}
function criarBarra(canvas, labels, valores){

    return new Chart(canvas,{

        type:"bar",

        data:{

            labels,

            datasets:[{

                data:valores

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}