<template>
    <div class="quoteInfo">
        <p><strong>Origem</strong>: {{ cepOrigem }}</p>
        <p><strong>Destino</strong>: {{ cepDestino }}</p>
        <p><strong>Resultados</strong>: {{ serviceDescription }} - R$ {{ formattedPrice }}</p>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useCurrencyFormat } from '@/hooks/useCurrencyFormat';

    export default {
        props: {
            cepOrigem: {
                type: String,
                required: true
            },
            cepDestino: {
                type: String,
                required: true
            },
            serviceDescription: {
                type: String,
                required: true
            },
            shippingPrice: {
                type: Number,
                required: true
            }
        },

        setup(props) {
            const { formattedPrice } = useCurrencyFormat(ref(props.shippingPrice));

            return {
                formattedPrice,
            };
        },
    }
</script>

<style scoped>
    .quoteInfo {
        flex-grow: 1;
    }
</style>