import mongoose from 'mongoose';

const maxImageBytes = 1024 * 1024;

const carSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true },
    company: { type: String, required: true, index: true },
    model: { type: String, required: true },
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    pricePkr: { type: Number, required: true, min: 1, index: true },
    year: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    imageData: {
      type: Buffer,
      required: true,
      select: false,
      validate: {
        validator: (value) => value?.length <= maxImageBytes,
        message: 'Image data must be 1MB or smaller.'
      }
    },
    imageType: { type: String, required: true, select: false },
    summary: { type: String, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    horsepower: { type: Number, required: true },
    topSpeedKph: { type: Number, required: true },
    colors: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
