

import mongoose from "mongoose";

const facturaSchema = mongoose.Schema(
	{
		type: String,
		typeId: Number,
		url: String,
		client :{
            RUTRecep: String,
			RznSocRecep: String,
			GiroRecep: String,
			DirRecep: String,
			CmnaRecep: String,
			name: String,
			phone:String,
			address:String
        },
		items: Array,
		totals:{
			MntNeto: Number,
            IVA: Number,
            MntTotal: Number
 		},
		store :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Store'
		},
		emisor :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Emisor'
		},
		counter:Number
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