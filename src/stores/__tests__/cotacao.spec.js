// import axios from 'axios';
// import { useCotacaoStore } from '../cotacao';
// import { createPinia, setActivePinia } from 'pinia';

// jest.mock('axios');

// describe('Cotacao Store', () => {
//     beforeEach(() => {
//         setActivePinia(createPinia());
//     });

//     it('cotarFrete deve buscar dados e atualizar o estado', async () => {
//         const store = useCotacaoStore();
//         const mockResponse = {
//             data: {
//                 ShippingSevicesArray: [{ ServiceDescription: 'Teste', OriginalDeliveryTime: 1, ShippingPrice: 10, OriginalShippingPrice: 15 }]
//             }
//         };

//         axios.post.mockResolvedValue(mockResponse);

//         await store.cotarFrete();

//         expect(store.resultados).toEqual(mockResponse.data.ShippingSevicesArray);
//         expect(store.carregando).toBe(false);
//         expect(store.mostrarHistorico).toBe(true);
//         expect(store.erro).toBeNull();
//     });

//     it('cotarFrete deve lidar com erros da API', async () => {
//         const store = useCotacaoStore();
//         const mockError = new Error('Erro na API');

//         axios.post.mockRejectedValue(mockError);

//         await store.cotarFrete();

//         expect(store.carregando).toBe(false);
//         expect(store.erro.message).toEqual(mockError.message);
//     });

//     it('saveHistory deve salvar a cotação no localStorage', () => {
//         const store = useCotacaoStore();
//         const cotacao = { dados: { cep_origin: '12345-678' }, resultados: [], timestamp: Date.now() };

//         store.saveHistory(cotacao);

//         const storedHistory = JSON.parse(localStorage.getItem('cotacoes_historico'));
//         expect(storedHistory[0].dados).toEqual(cotacao.dados);
//         expect(storedHistory[0].resultados).toEqual(cotacao.resultados);
//         expect(storedHistory[0].timestamp).toEqual(cotacao.timestamp);
//     });

//     it('recoverHistory deve recuperar o histórico do localStorage', () => {
//         const store = useCotacaoStore();
//         const cotacao = { dados: { cep_origin: '12345-678' }, resultados: [], timestamp: Date.now() };
//         localStorage.setItem('cotacoes_historico', JSON.stringify([cotacao]));
    
//         const recoveredHistory = store.recoverHistory();
//         expect(recoveredHistory).toEqual([cotacao]);
//     });

//     it('limparResultados deve limpar o array de resultados', () => {
//         const store = useCotacaoStore();
//         store.resultados = [{ ServiceDescription: 'Teste', OriginalDeliveryTime: 1, ShippingPrice: 10, OriginalShippingPrice: 15 }];
//         store.limparResultados();
//         expect(store.resultados).toEqual([]);
//     });

//     it('deve definir o estado inicial corretamente', () => {
//         const store = useCotacaoStore();
//         expect(store.resultados).toEqual([]);
//         expect(store.carregando).toBe(false);
//         expect(store.mostrarHistorico).toBe(false);
//         expect(store.erro).toBeNull();
//     });
// });

// /stores/__tests__/cotacao.spec.js
import { createPinia, setActivePinia } from 'pinia';
import { useCotacaoStore } from '../cotacao';
import axios from 'axios';

jest.mock('axios');

describe('Cotacao Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('deve inicializar o estado corretamente', () => {
        const store = useCotacaoStore();
        expect(store.dados).toEqual({
            cep_origin: '',
            cep_destination: '',
            weight: 0,
            width: 0,
            height: 0,
            length: 0,
            declared_value: 0,
        });
        expect(store.resultados).toEqual([]);
        expect(store.history).toEqual([]);
        expect(store.carregando).toBe(false);
        expect(store.mostrarHistorico).toBe(false);
        expect(store.erro).toBeNull();
    });

    it('deve cotar o frete com sucesso', async () => {
        const store = useCotacaoStore();
        store.dados = {
            cep_origin: '12345678',
            cep_destination: '87654321',
            weight: 1,
            width: 10,
            height: 10,
            length: 10,
            declared_value: 100,
        };

        const mockResponse = {
            data: {
                ShippingSevicesArray: [{ id: 1, name: 'Serviço 1' }],
            },
        };

        axios.post.mockResolvedValue(mockResponse);

        await store.cotarFrete();

        expect(store.resultados).toEqual([{ id: 1, name: 'Serviço 1' }]);
        expect(store.carregando).toBe(false);
        expect(store.mostrarHistorico).toBe(true);
        expect(store.erro).toBeNull();
        expect(axios.post).toHaveBeenCalled();
    });

    it('deve lidar com erros na cotação', async () => {
        const store = useCotacaoStore();
        axios.post.mockRejectedValue(new Error('Erro na requisição'));

        await store.cotarFrete();

        expect(store.erro).toBe('Erro na requisição');
        expect(store.carregando).toBe(false);
    });

    // it('deve salvar o histórico', () => {
    //     const store = useCotacaoStore();
    //     const cotacao = {
    //         dados: { cep_origin: '123' },
    //         resultados: [{ id: 1 }],
    //         timestamp: Date.now(),
    //     };

    //     store.saveHistory(cotacao);
    //     const history = JSON.parse(localStorage.getItem('cotacoes_historico'));
    //     expect(history).toEqual([cotacao]);
    // });

    it('deve recuperar o histórico', () => {
        const store = useCotacaoStore();
        const cotacao = {
            dados: { cep_origin: '123' },
            resultados: [{ id: 1 }],
            timestamp: Date.now(),
        };

        localStorage.setItem('cotacoes_historico', JSON.stringify([cotacao]));
        const recoveredHistory = store.recoverHistory();
        expect(recoveredHistory).toEqual([cotacao]);
    });

    it('deve detectar mudanças nos valores do formulário', () => {
        const store = useCotacaoStore();
        expect(store.areFormValuesChanged()).toBe(false);

        store.dados.cep_origin = '123';
        expect(store.areFormValuesChanged()).toBe(true);
    });
});