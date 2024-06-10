const { Schema, model } = require('mongoose');

const HospitalSchema = new Schema(
  {
    name: { type: String, required: [true, 'The name is required.'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The User ID is a required field.'] },
  },
  { collection: 'hospitals' }
);

HospitalSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('Hospital', HospitalSchema);
