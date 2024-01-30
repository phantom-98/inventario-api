import mongoose from "mongoose";
import moment from "moment-timezone";

const itemSchema = mongoose.Schema({
  price: Number,
  qty: Number,
  iva: Number,
  total: Number,
  productName: String,
  product: String,
});

const saleSchema = mongoose.Schema(
  {
    payType: String,
    voucher: String,
    total: Number,
    items: [itemSchema],
    box: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashRegister",
    },
    boletaUrl: String,
    clientRut: String,
    counter: Number,
  },
  {
    timestamps: true,
  }
);

saleSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
