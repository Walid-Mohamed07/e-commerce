import mongoose, { Schema, Document } from "mongoose";

interface IRole extends Document {
  name: string;
}

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

RoleSchema.post(
  "save",
  function (error: any, doc: IRole, next: (err?: any) => void) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      next(new Error("Duplicate role name entered"));
    } else {
      next(error);
    }
  }
);

const Role = mongoose.model<IRole>("Role", RoleSchema);

export default Role;
