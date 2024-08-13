import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  additionalData: { type: mongoose.Schema.Types.Mixed }
});

const Log = mongoose.model('Log', logSchema);

export default Log;
//    await logUserAction(req.user.id, 'Created a new resource', { resourceId: newResource._id });
