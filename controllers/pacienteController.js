import Paciente from "../models/Paciente.js"

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    console.log(paciente);
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes)
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params
   
        const paciente = await Paciente.findOne({ _id: id });

        if (!paciente) {
            const error = new Error('Paciente no encontrado')
            return res.status(404).json({ msj: error.message })
        }


        if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) {
            return res.status(403).json({ msj: "accion no valida" })
        }


        // Mostrar paciente
        return res.json(paciente)
        
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params
   
    const paciente = await Paciente.findOne({ _id: id });

    if (!paciente) {
        const error = new Error('Paciente no encontrado')
        return res.status(404).json({ msj: error.message })
    }


    if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) {
        return res.status(403).json({ msj: "accion no valida" })
    }


    // Mostrar paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
   
    try {
        const pacienteModificado = await paciente.save();
        res.json(pacienteModificado)
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente =  async (req, res) => {
    const { id } = req.params
   
    const paciente = await Paciente.findOne({ _id: id });

    if (!paciente) {
        const error = new Error('Paciente no encontrado')
        return res.status(404).json({ msj: error.message })
    }


    if (req.veterinario._id.toString() !== paciente.veterinario._id.toString()) {
        return res.status(403).json({ msj: "accion no valida" })
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'})
    } catch (error) {
        console.log(error);
    }
}

//


export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}