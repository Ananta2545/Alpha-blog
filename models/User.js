import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
    },
    email: {
        type: String,
    },
    password:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;