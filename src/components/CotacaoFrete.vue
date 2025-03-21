<script setup>
    import InformationIcon from './icons/IconInformation.vue';
    import FreightResults from './FreightResults.vue';
    import PrecoInput from './PrecoInput.vue';
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
                    <!-- <input
                        type="tel"
                        id="declared_value"
                        v-model.number="dados.declared_value"
                    > -->
                    <PrecoInput v-model="dados.declared_value" />
                </div>
            </div>
            <div class="footer-form">
                <!-- <span>Dicas para embalar seus pedidos</span> -->
                <button type="submit">Calcular frete</button>
            </div>
        </form>
    </div>
    <div v-if="resultados.length > 0">
        <FreightResults
            :name="resultados[0].ServiceDescription"
            :time="resultados[0].OriginalDeliveryTime"
            :price="resultados[0].ShippingPrice"
            :originalPrice="resultados[0].OriginalShippingPrice"
        />
    </div>
</template>

<script>
    import { ref } from 'vue';
    import axios from 'axios';
    import { VueMaskDirective } from 'vue-the-mask';

    export default {
        directives: { mask: VueMaskDirective, },
        setup() {
            const cep_origin = ref('');
            const cep_destination = ref('');
            const weight = ref('');

            return {
                cep_origin,
                cep_destination,
                weight
            };
        },

        data() {
            return {
                dados: {
                    cep_origin: '',
                    cep_destination: '',
                    weight: 0,
                    width: 0,
                    height: 0,
                    length: 0,
                    declared_value: 0,
                },
                resultados: [],
            };
        },
        methods: {
            async cotarFrete() {
                console.log('Dados do formulário:', this.dados);

                // Converter CEPs para números
                const cep_origin = parseInt(this.dados.cep_origin.replace(/\D/g, ''), 10);
                const cep_destination = parseInt(this.dados.cep_destination.replace(/\D/g, ''), 10);
                // Verifique se todos os valores são números válidos
                if (
                    isNaN(cep_origin) ||
                    isNaN(cep_destination) ||
                    typeof this.dados.weight !== 'number' ||
                    typeof this.dados.width !== 'number' ||
                    typeof this.dados.height !== 'number' ||
                    typeof this.dados.length !== 'number' ||
                    typeof this.dados.declared_value !== 'number'
                ) {
                    console.error('Erro: Todos os campos devem ser números.');
                    return;
                }

                try {
                    const response = await axios.post(
                        'http://localhost:3000/api/shipping/quote',
                        {
                            SellerCEP: this.dados.cep_origin,
                            RecipientCEP: this.dados.cep_destination,
                            ShipmentInvoiceValue: this.dados.declared_value,
                            ShippingItemArray: [
                                {
                                    Weight: this.dados.weight,
                                    Length: this.dados.length,
                                    Height: this.dados.height,
                                    Width: this.dados.width,
                                },
                            ],
                        }
                    );

                    console.log('Resultados da cotação:', response.data);
                    this.resultados = response.data.ShippingSevicesArray;
                } catch (error) {
                    if (error.response) {
                        // A requisição foi feita, mas a API retornou um código de erro
                        console.error('Erro na cotação:', error.response.data);
                        console.error('Status:', error.response.status);
                        console.error('Headers:', error.response.headers);
                    } else if (error.request) {
                        // A requisição foi feita, mas nenhuma resposta foi recebida
                        console.error('Erro na cotação: Nenhuma resposta recebida');
                        console.error(error.request);
                    } else {
                        // Algum outro erro aconteceu ao configurar a requisição
                        console.error('Erro na cotação:', error.message);
                    }
                }
            },
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
</style>