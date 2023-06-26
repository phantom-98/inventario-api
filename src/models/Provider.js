import mongoose from "mongoose";
import bcrypt from "bcrypt";

const transferSchema = mongoose.Schema(
	{
		bankName: String,
		accountType: String,
		accountNumber:Number,
		rut:Number

	}
)

const providerSchema = mongoose.Schema(
	{
		name:String,
		RUTRecep:String,
		email:String,
		transferData:transferSchema,
		RznSocRecep:String,
		GiroRecep:String,
		DirRecep:String,
		CmnaRecep:String,
		creditCondition:String,
		observaciones:String,
 	},
	{
		timestamps: true
	}
);


providerSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
