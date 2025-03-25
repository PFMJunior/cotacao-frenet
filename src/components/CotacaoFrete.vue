<script setup>
    import { useCotacaoStore } from '@/stores/cotacao';
    import PrecoInput from './PrecoInput.vue';
    import { VueMaskDirective } from 'vue-the-mask';
    import FreightResults from './FreightResults.vue';
    import QuoteHistory from './Quote/QuoteHistory.vue';
    import InformationIcon from './icons/IconInformation.vue';

    const cotacaoStore = useCotacaoStore();
</script>

<template>
    <div class="form-container">
        <h2>
            Calculadora de fretes
            <InformationIcon />
        </h2>

        <form @submit.prevent="cotacaoStore.cotarFrete">
            <div class="top">
                <div class="form-group">
                    <label for="cep_origin">CEP de Origem</label>
                    <input
                        type="tel"
                        id="cep_origin"
                        v-mask="'#####-###'"
                        v-model="cotacaoStore.dados.cep_origin"
                        placeholder="Digite o CEP"
                    />
                </div>
                <div class="form-group">
                    <label for="cep_destination">CEP de Destino</label>
                    <input
                        type="tel"
                        id="cep_destination"
                        v-mask="'#####-###'"
                        placeholder="Digite o CEP"
                        v-model="cotacaoStore.dados.cep_destination"
                    />
                </div>
            </div>
            <div class="bottom">
                <div class="form-group">
                    <label for="weight">Peso do Produto</label>
                    <div class="input-form">
                        <input
                            type="tel"
                            id="weight"
                            v-mask="'#.###.###'"
                            v-model.number="cotacaoStore.dados.weight"
                        >
                        <span>kg</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="width">Largura</label>
                    <div class="input-form">
                        <input
                            type="tel"
                            id="width"
                            maxlength="3"
                            v-model.number="cotacaoStore.dados.width"
                        >
                        <span>cm</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="height">Altura</label>
                    <div class="input-form">
                        <input
                            type="tel"
                            id="height"
                            maxlength="3"
                            v-model.number="cotacaoStore.dados.height"
                        >
                        <span>cm</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="length">Comprimento</label>
                    <div class="input-form">
                        <input
                            type="tel"
                            id="length"
                            maxlength="3"
                            v-model.number="cotacaoStore.dados.length"
                        >
                        <span>cm</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="declared_value">Valor Declarado</label>
                    <PrecoInput v-model="cotacaoStore.dados.declared_value" />
                </div>
            </div>
            <div class="footer-form">
                <button type="submit">Calcular frete</button>
            </div>
        </form>
    </div>

    <div v-if="cotacaoStore.carregando" class="loading">
        <p>Carregando resultados...</p>
    </div>

    <div v-if="cotacaoStore.erro" class="error">
        <p>Erro: {{ cotacaoStore.erro }}</p>
    </div>

    <div v-if="cotacaoStore.resultados.length > 0">
        <FreightResults
            :name="cotacaoStore.resultados[0].ServiceDescription"
            :time="cotacaoStore.resultados[0].OriginalDeliveryTime"
            :price="cotacaoStore.resultados[0].ShippingPrice"
            :originalPrice="cotacaoStore.resultados[0].OriginalShippingPrice"
        />
    </div>

    <QuoteHistory v-if="cotacaoStore.mostrarHistorico" :history="cotacaoStore.history" />
</template>

<script>
    export default {
        directives: { mask: VueMaskDirective },
    };
</script>

<style scoped>
    .form-container {
        background-color: var(--white);
        border: 1px solid var(--border-color);
        border-radius: .5rem;
        box-shadow: 0 .5rem 1.25rem 0 rgba(183, 198, 206, 0.30);

        padding: 0 2rem;
        width: 100%;
    }

    h2 {
        display: flex;
        align-items: center;
        gap: .5rem;

        color: var(--black);
        font-size: 1rem;
        font-weight: 500;

        letter-spacing: .6px;
        padding: 1.5rem 0 3rem 0;
    }
    
    h2 .bi-info-circle {
        cursor: pointer;
    }

    .top {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: flex-start;
        gap: 2rem;
    }

    .bottom {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: flex-start;
        gap: 1rem;

        margin-top: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
    }

    .form-group:last-child {
        margin-bottom: 0;
    }

    label {
        color: var(--black);

        font-size: .875rem;
        font-weight: 500;
        margin-bottom: .5rem;
    }

    input[type="text"],
    input[type="number"],
    input[type="tel"] {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--border-input);
        border-radius: 4px;
    }

    input:focus {
        outline: transparent;
        border: 1px solid transparent;
        box-shadow: 0 0 0 1px var(--blue-200);
    }

    .input-form {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .input-form span {
        position: absolute;
        top: 50%;
        transform: translatey(-50%);
        right: 1.5rem;

        color: var(--preto-60);
        font-size: 0.875rem;
    }

    .footer-form {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;

        margin: 1.75rem 0;
    }

    .footer-form button {
        background-color: var(--blue-500);
        border: 0;
        border-radius: 8px;

        cursor: pointer;
        color: var(--white);

        padding: .725rem 2rem;
        width: 12.5rem;
        transition: all.35s ease;
    }

    .footer-form button:hover {
        filter: brightness(.9);
    }

    .footer-form span {
        color: var(--blue-500);
        cursor: pointer;

        font-size: .875rem;
        font-weight: 500;
        
        line-height: initial;
        text-decoration: underline;
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: 1.5rem;
    }

    .loading p {
        color: var(--preto-60);
        font-size: 1.5rem;
    }

    .error {
        color: red;
        margin-top: 1rem;
        text-align: center;
    }

    @media (max-width: 1024px) {
        .form-container {
            padding: 0.75rem;
        }

        h2 {
            padding: 1.5rem 0;
        }

        .top {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .form-group {
            margin-bottom: 0;
        }

        .bottom {
            grid-template-columns: 1fr;
        }

        .footer-form {
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .footer-form button {
            width: 100%;
        }
    }
</style>