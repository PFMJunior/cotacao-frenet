<template>
    <div class="freight-results">
        <table class="calculator-results">
            <thead class="header">
                <tr>
                    <th>Modalidade</th>
                    <th></th> 
                    <th>Prazo</th>
                    <th>Proteção</th>
                    <th>Preço</th>
                    <th></th>
                    <th class="mobile">Contrato</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="image">
                            <img src="../assets/CARR-small.png" alt="Carrier Standard">
                            <div class="description">
                                <p class="name">Carriers Standard via Frenet</p>
                                <p class="postagem">Poste na agência mais proxíma</p>
                            </div>
                        </div>
                    </td>
                    <td class="new-trasnp" data-label="Transportadora">Nova Transportadora</td>
                    <td data-label="Prazo">2 dias</td>
                    <td data-label="Proteção"><div class="switch active"></div></td>
                    <td data-label="Preço">R$ 15,72</td>
                    <td class="mobile" data-label="Contrato">Via Frenet</td>
                    <td><button>Selecionar</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    .freight-results {
        margin-top: 1.5rem;
        width: 100%;
    }

    .calculator-results {
        background-color: var(--white);
        border: 1px solid var(--border-color);
        border-radius: .5rem;
        box-shadow: 0 .5rem 1.25rem 0 rgba(183, 198, 206, 0.30);
        
        border-collapse: collapse;
        width: 100%;
    }

    .header th, td {
        padding: 1.5rem;
        text-align: left;
    }

    .mobile {
        display: none;
    }

    .header span {
        color: var(--text-primary);
        font-size: 0.875rem;
        font-weight: 700;
        text-rendering: auto;
    }

    tbody tr:hover {
        background-color: #f9f9f9;
    }

    td img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        vertical-align: middle;
    }

    .image {
        display: flex;
        align-items: flex-start;
        gap: .5rem;
    }

    .image .postagem {
        color: #666666;
        font-size: 0.625rem;
        font-weight: 400;
        margin-top: .3rem;
    }

    .new-trasnp {
        display: inline-block;

        background: #E5F8EE;
        border-radius: .75rem;
        color: #00B66D;

        font-size: .75rem;
        font-weight: 600;

        padding: .125rem .5rem;
        text-align: center;
    }

    .switch {
        position: relative;
        display: inline-block;

        background-color: #ccc;
        border-radius: 8px;
        cursor: pointer;

        width: 30px;
        height: 16px;
    }

    .switch::after {
        content: '';
        width: 14px;
        height: 14px;
        background-color: white;
        border-radius: 50%;
        position: absolute;
        top: 1px;
        left: 1px;
        transition: transform 0.3s ease;
    }

    .switch.active {
        background-color: #2196F3;
    }

    .switch.active::after {
        transform: translateX(14px);
    }

    tr td:last-child {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }

    button {
        background-color: var(--blue-500);
        border: 0;
        border-radius: 8px;

        cursor: pointer;
        color: var(--white);

        font-weight: 600;
        font-size: 1rem;

        padding: 0.313rem 1rem;
        width: 8.125rem;
        transition: all.35s ease;
    }

    button:hover {
        filter: brightness(.9);
    }

    @media (max-width: 768px) {
        .calculator-results thead {
            display: none; /* Oculta o cabeçalho no celular */
        }

        .image .name {
            font-size: 0.875rem;
        }

        .calculator-results tbody tr {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1rem;
        }

        .calculator-results tbody td {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem;
        }

        .calculator-results tbody td:before {
            content: attr(data-label);
            font-weight: 600;
        }

        .calculator-results tbody td:last-child {
            justify-content: flex-start;
        }

        .calculator-results tbody td:nth-child(1) {
            flex-direction: column;
            align-items: flex-start;
        }

        .calculator-results tbody td:nth-child(2) {
            display: none;
        }

        /* .calculator-results tbody td:nth-child(4) {
            display: flex;
        } */

        /* .calculator-results tbody td:nth-child(3):before {
            content: 'Prazo: ';
        } */

        /* .calculator-results tbody td:nth-child(5):before {
            content: 'Preço: ';
        } */

        button {
            width: 100%;
        }
}
</style>