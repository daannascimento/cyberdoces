/* ==========================================
   UTILITÁRIOS
========================================== */

function moeda(valor){

    return Number(valor || 0)
        .toLocaleString(
            'pt-BR',
            {
                style:'currency',
                currency:'BRL'
            }
        );

}

function numero(valor){

    return Number(valor || 0)
        .toLocaleString('pt-BR');

}

function percentual(valor){

    return Number(valor || 0)
        .toFixed(2) + "%";

}

function dataBR(data){

    if(!data) return "";

    return data
        .split("-")
        .reverse()
        .join("/");

}

function hoje(){

    return new Date()
        .toLocaleDateString("pt-BR");

}

function agora(){

    return new Date()
        .toLocaleString("pt-BR");

}

function byId(id){

    return document.getElementById(id);

}

function toast(msg){

    alert(msg);

}