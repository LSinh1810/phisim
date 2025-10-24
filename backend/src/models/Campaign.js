import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: String,
  subject: String,
  message: String,
  recipients: [String],
  sentAt: Date,
  clicks: [
    {
      email: String,
      clickedAt: Date,
    },
  ],
});

export const Campaign = mongoose.model('Campaign', campaignSchema);