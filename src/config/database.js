// Trabajo con mongoDB de forma asincrónica
import mongoose from 'mongoose'

// Configuración de la conexión a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://leandrocruz:losandes2026@cluster1.qvipjp2.mongodb.net/?appName=Cluster1')
        console.log('Conexión a la base de datos exitosa')
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error)
    }
}

export default connectDB