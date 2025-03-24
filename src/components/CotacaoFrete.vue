<script setup>
    import axios from 'axios';
    import PrecoInput from './PrecoInput.vue';
    import { VueMaskDirective } from 'vue-the-mask';
    import FreightResults from './FreightResults.vue';
    import QuoteHistory from './Quote/QuoteHistory.vue';
    import { onMounted, ref, reactive, watch } from 'vue';
    import InformationIcon from './icons/IconInformation.vue';

    const carregando = ref(false);
    const history = ref([]);
    const mostrarHistorico = ref(false);

    const originalFormData = reactive({
        cep_origin: '',
        cep_destination: '',
        weight: 0,
        width: 0,
        height: 0,
        length: 0,
        declared_value: 0,
    });

    const dados = reactive({
        cep_origin: '',
        cep_destination: '',
        weight: 0,
        width: 0,
        height: 0,
        length: 0,
        declared_value: 0,
    });

    const resultados = ref([]);

    const HISTORY_KEY = 'cotacoes_historico';

    function saveHistory(cotacao) {
        let historyLocalStorage = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        historyLocalStorage.push(cotacao);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historyLocalStorage));
    }

    function recoverHistory() {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    }

    onMounted(() => {
        history.value = recoverHistory();
        Object.assign(originalFormData, JSON.parse(JSON.stringify(dados)));
    });

    function areFormValuesChanged() {
        for (const key in dados) {
            if (dados[key] !== originalFormData[key]) {
                return true;
            }
        }
        return false;
    }

    async function cotarFrete() {
        carregando.value = true;
        mostrarHistorico.value = false; // Oculta o histórico ao iniciar o cálculo

        console.log('Dados do formulário:', dados);

        if (
            typeof dados.weight !== 'number' ||
            typeof dados.width !== 'number' ||
            typeof dados.height !== 'number' ||
            typeof dados.length !== 'number' ||
            typeof dados.declared_value !== 'number'
        ) {
            console.error('Erro: Todos os campos devem ser números.');
            carregando.value = false;
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/api/shipping/quote',
                {
                    SellerCEP: dados.cep_origin,
                    RecipientCEP: dados.cep_destination,
                    ShipmentInvoiceValue: dados.declared_value,
                    ShippingItemArray: [
                        {
                            Weight: dados.weight,
                            Length: dados.length,
                            Height: dados.height,
                            Width: dados.width,
                        },
                    ],
                }
            );

            console.log('Resultados da cotação:', response.data);
            resultados.value = response.data.ShippingSevicesArray;
            carregando.value = false;
            mostrarHistorico.value = true; // Exibe o histórico após o cálculo

            saveHistory({
                dados: { ...dados },
                resultados: [...resultados.value],
                timestamp: Date.now(),
            });
            history.value = recoverHistory();
            console.log('aquiiiii', history.value);
            Object.assign(originalFormData, JSON.parse(JSON.stringify(dados)));

        } catch (error) {
            if (error.response) {
                console.error('Erro na cotação:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
                carregando.value = false;
            } else if (error.request) {
                console.error('Erro na cotação: Nenhuma resposta recebida');
                console.error(error.request);
                carregando.value = false;
            } else {
                console.error('Erro na cotação:', error.message);
                carregando.value = false;
            }
        }
    }
</script>

<template>
    <div class="form-container">
        <h2>
            Calculadora de fretes
            <InformationIcon />
        </h2>

        <form @submit.prevent="cotarFrete">
            <div class="top">
                <div class="form-group">
                    <label for="cep_origin">CEP de Origem</label>
                    <input
                        type="tel"
                        id="cep_origin"
                        v-mask="'#####-###'"
                        v-model="dados.cep_origin"
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
                        v-model="dados.cep_destination"
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
                            v-model.number="dados.weight"
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
                            v-model.number="dados.width"
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
                            v-model.number="dados.height"
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
                            v-model.number="dados.length"
                        >
                        <span>cm</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="declared_value">Valor Declarado</label>
                    <PrecoInput v-model="dados.declared_value" />
                </div>
            </div>
            <div class="footer-form">
                <button type="submit">Calcular frete</button>
            </div>
        </form>
    </div>

    <div v-if="carregando" class="loading">
        <p>Carregando resultados...</p>
    </div>

    <div v-if="resultados.length > 0">
        <FreightResults
            :name="resultados[0].ServiceDescription"
            :time="resultados[0].OriginalDeliveryTime"
            :price="resultados[0].ShippingPrice"
            :originalPrice="resultados[0].OriginalShippingPrice"
        />
    </div>

    <QuoteHistory v-if="mostrarHistorico" :history="history" />
</template>

<script>
    export default {
        directives: { mask: VueMaskDirective, },
        setup() {
            return {
                dados,
                resultados,
                history,
                carregando,
                cotarFrete,
            };
        },
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

    @media (max-width: 1024px) {
        .form-container {
            padding: 0.75rem;
        }

        .top {
            grid-template-columns: 1fr;
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
</style>