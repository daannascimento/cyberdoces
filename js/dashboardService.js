/* ==========================================================
   DASHBOARD SERVICE
========================================================== */

const DashboardService = {

    /* ==========================================
       KPIs PRINCIPAIS
    ========================================== */

    async getKPIs() {

        const hoje = new Date().toISOString().split("T")[0];

        //==========================
        // VENDAS
        //==========================

        const {
            data: vendas
        } = await client
            .from("vendas_resumo")
            .select("*")
            .order("data_venda");

        //==========================
        // GASTOS
        //==========================

        const {
            data: gastos
        } = await client
            .from("gastos")
            .select("*");

        //==========================
        // REEMBOLSOS
        //==========================

        const {
            data: reembolsos
        } = await client
            .from("reembolsos")
            .select("*");

        //==========================
        // CAIXA
        //==========================

        const {
            data: movimentacoes
        } = await client
            .from("movimentacoes")
            .select("*");

        //-------------------------------------------------

        let faturamentoHoje = 0;

        let faturamentoMes = 0;

        let vendasHoje = 0;

        let ticketMedio = 0;

        let caixa = 0;

        let totalInvestido = 0;

        let totalReembolsado = 0;

        let dividaParcelada = 0;

        let gastosVista = 0;

        //-------------------------------------------------

        vendas.forEach(v => {

            const data = v.data_venda;

            if (data === hoje) {

                faturamentoHoje += Number(v.valor_bruto);

                vendasHoje += Number(v.quantidade_vendas);

            }

            faturamentoMes += Number(v.valor_bruto);

        });

        //-------------------------------------------------

        ticketMedio =
            vendasHoje > 0
                ? faturamentoHoje / vendasHoje
                : 0;

        //-------------------------------------------------

        movimentacoes.forEach(m => {

            if (m.tipo === "entrada") {

                caixa += Number(m.valor);

            } else {

                caixa -= Number(m.valor);

            }

        });

        //-------------------------------------------------

        gastos.forEach(g => {

            totalInvestido += Number(g.valor);

            const parcelas =
                g.parcelas || 1;

            if (parcelas > 1) {

                const valorParcela =
                    Number(
                        g.valor_parcela ||
                        (g.valor / parcelas)
                    );

                const restantes =
                    parcelas -
                    (g.parcela_atual || 1) + 1;

                dividaParcelada +=
                    restantes *
                    valorParcela;

            } else {

                gastosVista +=
                    Number(g.valor);

            }

        });

        //-------------------------------------------------

        reembolsos.forEach(r => {

            totalReembolsado +=
                Number(r.valor);

        });

        //-------------------------------------------------

        return {

            faturamentoHoje,

            faturamentoMes,

            vendasHoje,

            ticketMedio,

            caixa,

            totalInvestido,

            totalReembolsado,

            saldoSocios:
                totalInvestido -
                totalReembolsado,

            dividaParcelada,

            gastosVista,

            totalDevido:

                dividaParcelada +

                gastosVista

        };

    },



    /* ==========================================
       EVOLUÇÃO DAS VENDAS
    ========================================== */

    async getResumoVendas() {

        return await client

            .from("vendas_resumo")

            .select("*")

            .order("data_venda");

    },



    /* ==========================================
       CATEGORIAS
    ========================================== */

    async getCategorias() {

        return await client

            .from("vendas_categoria")

            .select("*");

    },



    /* ==========================================
       PRODUTOS
    ========================================== */

    async getProdutos() {

        return await client

            .from("vendas_produtos")

            .select("*");

    },



    /* ==========================================
       HORÁRIOS
    ========================================== */

    async getHorarios() {

        return await client

            .from("vendas_hora")

            .select("*");

    },

    /* ==========================================
   BUSINESS INTELLIGENCE
========================================== */

    async getBI() {

        const [
            resumo,
            categorias,
            produtos,
            horarios
        ] = await Promise.all([

            this.getResumoVendas(),

            this.getCategorias(),

            this.getProdutos(),

            this.getHorarios()

        ]);

        return {

            resumo: resumo.data || [],

            categorias: categorias.data || [],

            produtos: produtos.data || [],

            horarios: horarios.data || []

        };

    }
};

