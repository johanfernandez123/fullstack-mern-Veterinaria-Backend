import connectMongoose from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import veterinarioRutas from './routers/veterinarioRoters.js';
import pacienteRutas from './routers/pacienteRouters.js';
const app = express();

// leer variables de entorno
dotenv.config();

//conectar db 
connectMongoose()

const dominiosPermitidos = ["https://friendly-cascaron-ee290e.netlify.app"];

const corsOptions = {
    origin: function (origin,callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // el origen reques esta permitido
            callback(null,true)
        }else{
            callback(new Error('Error CORS no permitido'))
        }
    }
};

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/veterinarios',veterinarioRutas);
app.use('/api/pacientes',pacienteRutas);

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}/`);
})