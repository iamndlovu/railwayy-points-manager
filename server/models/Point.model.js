const { type } = require('@testing-library/user-event/dist/type');
const { Schema, model } = require('mongoose');

const PointSchema = new Schema(
  {
    pointName: { type: String, required: true, unique: true },
    status: { type: Number, default: 0 },
    routes: { type: Array, required: true },
    safeRoute: { type: Number },
    requestedRoute: { type: Number },
    prevSafe: { type: Number },
    lastFault: { type: Date },
    changeTimes: { type: Array, default: [7.2] },
  },
  { timestamps: true }
);

const Point = model('Point', PointSchema);

module.exports = Point;
