/* ==========================================================
   SERVICES
   Loja Dan & Rafa
========================================================== */

/* ==========================================
   DASHBOARD
========================================== */

const DashboardService = {

    async getResumoVendas() {

        return await client
            .from("vendas_resumo")
            .select("*")
            .order("data_venda", { ascending: false });

    },

    async getCategorias() {

        return await client
            .from("vendas_categoria")
            .select("*");

    },

    async getProdutos() {

        return await client
            .from("vendas_produtos")
            .select("*");

    },

    async getHorarios() {

        return await client
            .from("vendas_hora")
            .select("*");

    },

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


/* ==========================================
   GASTOS
========================================== */

const GastoService = {

    async listar() {

        return await client
            .from("gastos")
            .select("*")
            .order("id", { ascending: false });

    },

    async inserir(gasto) {

        return await client
            .from("gastos")
            .insert([gasto]);

    },

    async atualizar(id, dados) {

        return await client
            .from("gastos")
            .update(dados)
            .eq("id", id);

    },

    async buscar(id){

    return await client
        .from("gastos")
        .select("*")
        .eq("id",id)
        .single();

}

};


/* ==========================================
   REEMBOLSOS
========================================== */

const ReembolsoService = {

    async listar() {

        return await client
            .from("reembolsos")
            .select("*")
            .order("id", { ascending: false });

    },

    async inserir(reembolso) {

        return await client
            .from("reembolsos")
            .insert([reembolso]);

    }

};


/* ==========================================
   CAIXA
========================================== */

const CaixaService = {

    async listar() {

        return await client
            .from("movimentacoes")
            .select("*")
            .order("data_movimentacao", { ascending: false });

    },

    async inserir(dados) {

        return await client
            .from("movimentacoes")
            .insert([dados]);

    }

};


/* ==========================================
   METAS
========================================== */

const MetaService = {

    async listar() {

        return await client
            .from("metas")
            .select("*");

    }

};

