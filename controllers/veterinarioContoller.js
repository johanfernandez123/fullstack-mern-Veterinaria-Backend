import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePasword from "../helpers/emailOlvidePassword.js";
const registrar = async (req, res) => {
    const { email,nombre } = req.body;


    // Prevenir usuarios duplicados
    const exiteUsuario = await Veterinario.findOne({ email })

    if (exiteUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token            
        })

        res.json(veterinarioGuardado)

    } catch (error) {
        console.log(error);
    }

};


const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({
            msg: "Usuario confirmado correctamente",
        })

    } catch (error) {

        console.log(error);

    }


}


const autenticar = async (req, res) => {
    const { email, password } = req.body

    const usuario = await Veterinario.findOne({email});

    //comprobar si el usuario existe
    if(!usuario){
        const error = new Error('Usuario no existe')
       return res.status(403).json({msg: error.message})
    }

    //comprobar si el usuario esta confirmado

    if(!usuario.confirmado){
        const error = new Error('El usuario no esta confirmado');
        return res.status(403).json({msg: error.message})
    }

    // Revisar Pasword
    const passworCorrecto = await usuario.comprobarPassword(password)
    if(!passworCorrecto){
        const error = new Error('Password incorrecto')
       return res.status(403).json({msg: error.message})
    }

    // Autenticar al usuario
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    })
    
}

const olvidePassword = async (req,res) => {

    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        const error = new Error('No existe el usuario');
        return res.status(400).json({msg: error.message});
    }

    existeVeterinario.token = generarId();
    await existeVeterinario.save();

    //Enviar instrucciones 
    emailOlvidePasword({
    email,
    nombre: existeVeterinario.nombre,
    token: existeVeterinario.token
    })
    res.json({msg: "Hemos enviado instruciones a su correo"})
}

const comprobarToken = async (req,res) => {
    const {token} = req.params;
    const tokenExiste = await Veterinario.findOne({token});

    console.log(tokenExiste);
    if(!tokenExiste){
        const error = new Error('Token inexistente o invalido')
       return res.status(400).json({msg: error.message})
    }

    return res.json({msg: "token valido si puede cambiar la contraseña"})

}

const nuevoPassword = async (req,res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
       return res.status(400).json({msg: error.message})
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Contraseña modificada correctamente"})
    } catch (error) {
        console.log(error);
    }
   
}







const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario)
}

const actualizarPerfil = async (req,res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
            const error = new Error('Ese correo ya esta en uso');
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre;
        veterinario.email = req.body.email || veterinario.email;
        veterinario.web = req.body.web ;
        veterinario.telefono = req.body.telefono ;


        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error);
    }
}


const actualizarPassword = async (req,res) => {
    // Leer datos
    const {id} = req.veterinario
    const {password,nuevopassword} = req.body

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    //comprobar su password
    if(await veterinario.comprobarPassword(password)){
        // Almacenar el nuevo password
        veterinario.password = nuevopassword;
        await veterinario.save();
        return res.json({msg: 'Contraseña Modificada Correctamente'})
    }else{
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({msg: error.message})
    }

    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}