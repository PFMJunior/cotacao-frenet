<template>
    <div class="quoteHistory" v-if="history.length > 0">
        <h2>Histórico de Cotações</h2>
        <ul>
            <li v-for="cotacao in history" :key="cotacao.timestamp" class="quoteItem">
                <QuoteInfo
                    :cepOrigem="cotacao.dados.cep_origin"
                    :cepDestino="cotacao.dados.cep_destination"
                    :serviceDescription="cotacao.resultados[0].ServiceDescription"
                    :shippingPrice="cotacao.resultados[0].ShippingPrice"
                />
            </li>
        </ul>
    </div>
</template>

<script>
    import QuoteInfo from './QuoteInfo.vue';
    
    export default {
        components: {
            QuoteInfo
        },

        props: {
            history: {
                type: Array,
                required: true
            }
        },
    }
</script>

<style scoped>
    .quoteHistory {
        background-color: var(--white);
        border: 1px solid var(--border-color);
        border-radius: .5rem;
        box-shadow: 0 .5rem 1.25rem 0 rgba(183, 198, 206, 0.30);

        margin-top: 2rem;
        padding: 0 2rem;
        width: 100%;
        height: 20rem;
        overflow: auto;
    }

    h2 {
        position: sticky;
        top: 0;

        background-color: var(--white);
        color: var(--black);
        
        font-size: 1rem;
        font-weight: 500;

        letter-spacing: .6px;
        padding: 1.5rem 0 .5rem 0;
    }
    
    .quoteItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
    }
</style>