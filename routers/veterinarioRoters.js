import express from 'express';
import {
    perfil,
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioContoller.js';

import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas que no necesitan estar protegidas
router.post('/', registrar);
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password',olvidePassword);
router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword)

//Rutas protegidas
router.get('/perfil',checkAuth, perfil);
router.put('/perfil/:id',checkAuth,actualizarPerfil)
router.put('/actualizar-password', checkAuth,actualizarPassword)

export default router;