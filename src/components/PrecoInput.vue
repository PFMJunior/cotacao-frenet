<template>
    <input
        type="text"
        :value="valorFormatado"
        @input="formatarValor"
    />
</template>

<script>
    export default {
        props: {
            modelValue: Number,
        },
        computed: {
            valorFormatado() {
                if (this.modelValue === null || this.modelValue === undefined) {
                    return '';
                }
                return (this.modelValue / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                });
            },
        },
        methods: {
            formatarValor(event) {
                let valor = event.target.value.replace(/\D/g, '');
                let valorNumerico = parseInt(valor);

                if (isNaN(valorNumerico)) {
                    this.$emit('update:modelValue', null);
                    return;
                }

                this.$emit('update:modelValue', this.ajustarCentavos(valorNumerico));
            },
            ajustarCentavos(valorNumerico) {
                const centavos = valorNumerico % 100;
                const parteInteira = Math.floor(valorNumerico / 100);

                if (centavos === 0) {
                    return parteInteira * 100; // Remove os centavos .00
                } else {
                    return valorNumerico; // Mantém os centavos existentes
                }
            },
        },
    };
</script>