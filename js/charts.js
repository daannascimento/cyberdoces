/* ==========================================
   CHARTS
========================================== */

function destruir(chart){

    if(chart){

        chart.destroy();

    }

}

function criarPizza(ctx,labels,valores){

    return new Chart(ctx,{

        type:"pie",

        data:{

            labels,

            datasets:[{

                data:valores

            }]

        }

    });

}

function criarBarra(ctx,labels,valores){

    return new Chart(ctx,{

        type:"bar",

        data:{

            labels,

            datasets:[{

                data:valores

            }]

        }

    });

}

function criarLinha(ctx,labels,valores){

    return new Chart(ctx,{

        type:"line",

        data:{

            labels,

            datasets:[{

                data:valores,

                tension:.3,

                fill:false

            }]

        }

    });

}