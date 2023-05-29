

import mongoose from "mongoose";

const facturaSchema = mongoose.Schema(
	{
		type: String,
		client :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Clients'
        }
        
 	},
	{
		timestamps: true
	}
);


facturaSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Factura = mongoose.model("Factura", facturaSchema);
export default Factura;