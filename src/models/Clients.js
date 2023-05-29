import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clientSchema = mongoose.Schema(
	{
		type: String,
		rut:String,
		razonsocial: String,
		giro:String,
		name:String,
		lastName:String	,
		withCredit:Boolean,
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		phone:String,
		address:String,
		city:String,
		comuna:String,
		nota: String,
 	},
	{
		timestamps: true
	}
);


clientSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Client = mongoose.model("Client", clientSchema);
export default Client;
