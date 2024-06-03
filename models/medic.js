const { Schema, model } = require('mongoose');

const MedicSchema = new Schema(
  {
    name: { type: String, required: [true, 'The name is required.'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'The User ID is a required field.'] },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'The hospital ID is a required field.'],
    },
  },
  { collection: 'medics' }
);

MedicSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model('Medic', MedicSchema);
