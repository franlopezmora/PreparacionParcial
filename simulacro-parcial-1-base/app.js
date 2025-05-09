import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Programar endpoints aquí


(async function start() {
    // Validar conexión a la base de datos.

    // Iniciar el servidor
    app.listen(PORT, () => {
        console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
    });
})();
