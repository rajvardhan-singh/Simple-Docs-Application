import mongoose from "mongoose";

const Connection = async (username = 'Raj', password = '2vCV9sMBW9YwT6KI') => {
    // const URL = `mongodb+srv://${username}:${password}@doceditor.46ejg60.mongodb.net/?retryWrites=true&w=majority`
    const URL = `mongodb+srv://${username}:${password}@doceditor.46ejg60.mongodb.net/?retryWrites=true&w=majority`

    try {
        await mongoose.connect(URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log("successfully connected...");
    } catch (error) {
        console.log('error while connecting....', error);
    }
}


export default Connection;