import mongoose from "mongoose";


const storeSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
			trim: true,
		},
		apiKeys: {
			type: Object,
		},
		phone: {
			type: String,
		},
		status: {
			type: Boolean,
		},
		type: {
			type: String,
		},
 	},
	{
		timestamps: true
	}
);


storeSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Store = mongoose.model("Store", storeSchema);
export default Store;
