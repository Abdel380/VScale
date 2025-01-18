<template>
    <div>
        <h1>Connection Builder</h1>

        <div>
            <h2>Reccuperer un token :</h2>
            <button @click="fetchToken">Reccuperer un token</button>
            <p v-if="response">{{ response }}</p>
        </div>

        <div>
            <h2>Get a single access code :</h2>
            <button @click="getCode">Reccuperer un code</button>
            <p v-if="code">{{ code }}</p>
        </div>

        <p v-if="url">{{ url }}</p>
        <button @click="redirectToUrl">Rediriger vers l'URL</button>
    </div>
</template>

<script>
import { fetchCode, getAuthToken } from '../services/api';

export default {
    data() {
        return {
            response: null,
            code: null,
            url: null,
        };
    },
    methods: {
        async fetchToken() {
            try {
                this.response = await getAuthToken();
                console.log("Enregistrement du token");
                sessionStorage.setItem('auth_token', this.response.auth_token);
                sessionStorage.setItem('id_user', this.response.id_user);
                console.log("Token stocké dans le session storage.");

            } catch (error) {
                console.error('Erreur lors de l\'envoi des données 1');
            }
        },
        async getCode() {
            try {
                const token = sessionStorage.getItem('auth_token');
                if (!token){
                    alert("Aucun token retrouvé");
                }
                console.log("Token réccupéré du session storage");
                this.code = await fetchCode(token);
                sessionStorage.setItem('data_code', this.code);
                this.url = `https://webview.powens.com/fr/connect?domain=tscale-sandbox&client_id=38585586&redirect_uri=http://localhost:5173/&code=${this.code.data.code}`;
            } catch (error) {
                console.error('Erreur lors de la récupération des données');
            }
        },
        async redirectToUrl() {
            window.location.assign(this.url)
        }

    },
};
</script>
