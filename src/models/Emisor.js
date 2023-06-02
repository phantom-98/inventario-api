import mongoose from "mongoose";

const emisorSchema = mongoose.Schema(
	{
		"RUTEmisor": String,
        "RznSocEmisor": String,
        "GiroEmisor": String,
        "CdgSIISucur": String,
        "DirOrigen": String,
        "CmnaOrigen": String,
 	},
	{
		timestamps: false
	}
);


emisorSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Emisor = mongoose.model("Emisor", emisorSchema);
export default Emisor;
