import mongoose from "mongoose";

const movementSchema = mongoose.Schema(
	{
        amount: Number,
		reason: String,
		type: String,
		user :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		}
 	},
	{
		timestamps: true
	}
);


const cashRegisterSchema = mongoose.Schema(
	{
        name: String,
		movements:[movementSchema],
        store :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Store'
		}
 	}
);


cashRegisterSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const CashRegister = mongoose.model("CashRegister", cashRegisterSchema);
export default CashRegister;


