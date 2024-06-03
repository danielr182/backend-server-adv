const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a allowed role.',
};

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, 'The name is required.'] },
    email: { type: String, unique: true, required: [true, 'The email is required.'] },
    password: { type: String, required: [true, 'The password is required.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, default: false },
  },
  { collection: 'users' }
);

UserSchema.plugin(uniqueValidator, { message: 'There is already a user with the same value in the field {PATH}.' });
UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('User', UserSchema);
