import { Model, ObjectId, Schema, model, models } from "mongoose";

interface FavoriteDocument {
    owner: ObjectId;
    items: ObjectId[];
}

const favoriteSchema = new Schema<FavoriteDocument>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: "Audio",
            },
        ],
    },
    { timestamps: true }
);

const Favorite = models.Favorite || model("Favorite", favoriteSchema);

export default Favorite as Model<FavoriteDocument>;
