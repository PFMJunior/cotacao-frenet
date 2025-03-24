<template>
    <div>
        <form @submit.prevent="buscarCotacao">
            <input type="text" v-model="cep" placeholder="Digite o CEP" />
            <button type="submit">Buscar</button>
        </form>
        <span v-if="cotacaoStore.carregando">Carregando...</span>
        <span v-if="cotacaoStore.erro">{{ cotacaoStore.erro }}</span>
        <div v-if="cotacaoStore.resultados.length > 0">
            <p>Valor total: {{ cotacaoStore.resultados[0].ShippingPrice }}</p>
            <p>Descrição do serviço: {{ cotacaoStore.resultados[0].ServiceDescription }}</p>
        </div>
    </div>
</template>

<script setup>
    import { useCotacaoStore } from '@/stores/cotacao';
    import { ref } from 'vue';

    const cotacaoStore = useCotacaoStore();
    const cep = ref('');

    const buscarCotacao = () => {
        cotacaoStore.dados.cep_destination = cep.value;
        cotacaoStore.cotarFrete();
    };
</script>