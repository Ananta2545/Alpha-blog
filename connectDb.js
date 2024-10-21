import mongoose from "mongoose";

const mongoURI = 'mongodb://localhost:27017/alphablog'

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

export default connectToMongo;