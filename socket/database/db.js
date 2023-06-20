import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const Connection = async () => {
    // const URL = `mongodb+srv://${username}:${password}@doceditor.46ejg60.mongodb.net/?retryWrites=true&w=majority`
    const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@doceditor.46ejg60.mongodb.net/?retryWrites=true&w=majority`

    try {
        await mongoose.connect(URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log("successfully connected to database...");
    } catch (error) {
        console.log('error while connecting....', error);
    }
}


export default Connection;