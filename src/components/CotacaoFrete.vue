<script setup>
    import InformationIcon from './icons/IconInformation.vue';
    import FreightResults from './FreightResults.vue'
</script>

<template>
    <div class="form-container">
        <h2>
            Calculadora de fretes
            <InformationIcon />
        </h2>
        <form>
            <div class="top">
                <div class="form-group">
                    <label for="cep_origin">CEP de Origem:</label>
                    <input
                        type="text"
                        id="cep_origin"
                    >
                </div>
                <div class="form-group">
                    <label for="cep_destination">CEP de Destino:</label>
                    <input
                        type="text"
                        id="cep_destination"
                    >
                </div>
            </div>
            <div class="bottom">
                <div class="form-group">
                    <label for="weight">Peso do Produto (kg):</label>
                    <input
                        type="number"
                        id="weight"
                    >
                </div>
                <div class="form-group">
                    <label for="width">Largura (cm):</label>
                    <input
                        type="number"
                        id="width"
                    >
                </div>
                <div class="form-group">
                    <label for="height">Altura (cm):</label>
                    <input
                        type="number"
                        id="height"
                    >
                </div>
                <div class="form-group">
                    <label for="length">Comprimento (cm):</label>
                    <input
                        type="number"
                        id="length"
                    >
                </div>
                <div class="form-group">
                    <label for="declared_value">Valor Declarado:</label>
                    <input
                        type="number"
                        id="declared_value"
                    >
                </div>
            </div>
            <div class="footer-form">
                <!-- <span>Dicas para embalar seus pedidos</span> -->
                <button type="submit">Calcular frete</button>
            </div>
        </form>
    </div>
    <FreightResults />
</template>

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
    input[type="number"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
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