// /stores/cotacao.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCotacaoStore = defineStore('cotacao', {
    state: () => ({
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
        history: [],
        carregando: false,
        mostrarHistorico: false,
        erro: null, // Adicionado estado de erro
        originalFormData: {
            cep_origin: '',
            cep_destination: '',
            weight: 0,
            width: 0,
            height: 0,
            length: 0,
            declared_value: 0,
        },
    }),
    actions: {
        async cotarFrete() {
            this.carregando = true;
            this.mostrarHistorico = false;
            this.erro = null; // Limpar erros anteriores

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

                this.resultados = response.data.ShippingSevicesArray;
                this.carregando = false;
                this.mostrarHistorico = true;

                this.saveHistory({
                    dados: { ...this.dados },
                    resultados: [...this.resultados],
                    timestamp: Date.now(),
                });
                this.history = this.recoverHistory();
                Object.assign(this.originalFormData, JSON.parse(JSON.stringify(this.dados)));

            } catch (error) {
                console.error('Erro na cotação:', error);
                this.erro = error.message || 'Erro desconhecido ao cotar frete.';
                this.carregando = false;
            }
        },
        saveHistory(cotacao) {
            let historyLocalStorage = JSON.parse(localStorage.getItem('cotacoes_historico')) || [];
            historyLocalStorage.push(cotacao);
            localStorage.setItem('cotacoes_historico', JSON.stringify(historyLocalStorage));
        },
        recoverHistory() {
            return JSON.parse(localStorage.getItem('cotacoes_historico')) || [];
        },
        areFormValuesChanged() {
            for (const key in this.dados) {
                if (this.dados[key] !== this.originalFormData[key]) {
                    return true;
                }
            }
            return false;
        },
    },
    limparResultados() {
        this.resultados = [];
    },
});