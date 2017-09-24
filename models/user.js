import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  _id: String,
  displayName: String,
  accessToken: String,
  refreshToken: String,
  image: String,
});

export default mongoose.model('User', userSchema);
