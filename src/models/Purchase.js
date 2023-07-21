import mongoose from "mongoose";


const purchaseSchema = mongoose.Schema(
	{
        provider :{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Provider'
		},
        products :[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Product'
                }
            }
        ],
		qty: Number,
		price: Number,
        Total: Number,
		
 	},
	{
		timestamps: true
	}
);


purchaseSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;