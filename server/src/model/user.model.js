import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//* Schema definition
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'user', 'deliveryBoy'],
      required: true,
    },
    resetPasswordOtp: {
      type: String,
      default: '',
    },
    resetPasswordOtpExpiry: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//* Pre save hook to hash the password and convert email to lowercase
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.email = this.email.toLowerCase();
  next();
});

//* Create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

//* Export the model
export default User;
