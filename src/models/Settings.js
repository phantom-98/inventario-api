import mongoose from "mongoose";


const settingsSchema = mongoose.Schema(
	{
		key: String,
		value: String,
		
 	},
	{
		timestamps: true
	}
);


settingsSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})


const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;