import mongoose from "mongoose";

const dashBoardDataSchema = mongoose.Schema(
  {
    salePerMonth: Object,
    contribution: Object,
    inventory: Object,
  },
  {
    timestamps: true,
  }
);

dashBoardDataSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const DashBoardData = mongoose.model("DashBoardData", dashBoardDataSchema);
export default DashBoardData;
