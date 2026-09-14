import { Types } from "mongoose";

export function toResponseId(doc: { _id: Types.ObjectId }): string {
    return doc._id.toString();
}