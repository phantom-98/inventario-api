import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    stock: { type: String },
    stock_at: { type: Date, default: Date.now },
});

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;