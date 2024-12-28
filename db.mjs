import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import dotenv from 'dotenv';

dotenv.config(); 
//mongoose.connect("mongodb+srv://fd2190:test@cluster0.ftnon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
mongoose.connect(process.env.DSN);
//mongoose.connect("mongodb://127.0.0.1/finalProject");


//user Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//transaction Schema
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name:{
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=username%>' });
transactionSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=type%>' });

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

export { User, Transaction };