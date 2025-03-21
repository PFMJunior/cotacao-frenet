import { ref, computed } from 'vue';

export function useCurrencyFormat(price) {
    const formattedPrice = computed(() => {
        if (!price.value) {
            return 'R$ 0,00';
        }

        const numericPrice = parseFloat(price.value);

        if (isNaN(numericPrice)) {
            return 'Valor inválido';
        }

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numericPrice);
    });

    return { formattedPrice };
}