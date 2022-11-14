import mongoose from "mongoose";

const connectMongoose = async () => {
    try {

        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${db.connection.host}: ${db.connection.port}`
        console.log(`MongoDB conectada en ${url}`);
        
    } catch (error) {
        console.error(`error: ${error.message}`);
        process.exit(1)
    }
}

export default connectMongoose