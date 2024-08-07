import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'It looks like this email is already in use. You might already be a member of Feels!'], // Email uniqueness
      required: [true, 'We need your email to proceed. Please provide it.'],  // Email required
      trim: true,                            // Removes extra spaces
      lowercase: true,                       // Converts email to lowercase
    },
    username: {
      type: String,
      required: [true, 'A username is needed to set up your account. Please choose one.'], // Username required
      trim: true,                             // Removes extra spaces
      unique: [true, 'This username is already taken. Please choose another one.'], // Username uniqueness
      minlength: [3, 'Your username should be at least 3 characters long. Try a longer one.'], // Minimum length
      maxlength: [30, 'Username can’t be longer than 30 characters. Please shorten it.'], // Maximum length
    },
    image: {
      type: String,
      default: 'default-profile.png', // Default image
      validate: {
        validator: function(v) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v); // Image URL format validation
        },
        message: 'The image URL seems to be invalid. Please provide a valid URL in PNG, JPG, JPEG, or GIF format.', // URL format
      },
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property', // References the Property model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = models.User || model('User', UserSchema);

export default User;
