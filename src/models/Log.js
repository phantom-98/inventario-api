import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  prevData: String,
  newData:String
});

const Log = mongoose.model('Log', logSchema);

export default Log;
//    await logUserAction(req.user.id, 'Created a new resource', { resourceId: newResource._id });
