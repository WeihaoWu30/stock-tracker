import mongoose from 'mongoose'

const holdingSchema = new mongoose.Schema({
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    stocks : [
        {
            name: {type: String},
            shares: {type: Number, required: true},
            price: {type: Number},
        }
    ],
    balance:{
        current,
        netChange,
        capitalGain
    }
});

const Holding = mongoose.model('portfolio', holdingSchema);
export default Holding;