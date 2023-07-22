

import mongoose from "mongoose";

const facturaSchema = mongoose.Schema(
	{
		folio: Number,
		type: String,
		typeId: Number,
		url: String,
		formaPago:Number,
		client :{
            RUTRecep: String,
			RznSocRecep: String,
			GiroRecep: String,
			DirRecep: String,
			CmnaRecep: String,
			name: String,
			phone:String,
			address:String,
			provider:{
				type:mongoose.Schema.Types.ObjectId,
				ref:'Provider'
			},
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
		emisorData:{},
		provider:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Provider'
		},
		counter:Number,
		format:{ type: String, default: 'Emitido' },
        status:String,
        expired_at:String,
        obs:String,
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