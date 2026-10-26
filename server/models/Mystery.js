const mongoose = require('mongoose');

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  motive: { type: String, required: true },
});

const WhatsappLogSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  timestamp: { type: String, required: true },
  message: { type: String, required: true },
});

const ImageClueSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  description: { type: String, required: true },
});

const CamRecordingSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  description: { type: String, required: true },
});

const MysterySchema = new mongoose.Schema(
  {
    userScenario: { type: String, required: true },
    storyline: { type: String, default: '' },
    suspects: { type: [SuspectSchema], default: [] },
    culpritId: { type: String, default: '' },
    evidence: {
      whatsappLogs: { type: [WhatsappLogSchema], default: [] },
      images: { type: [ImageClueSchema], default: [] },
      camRecordings: { type: [CamRecordingSchema], default: [] },
    },
    explanation: { type: String, default: '' },
    status: {
      type: String,
      enum: ['generating', 'ready', 'solved', 'failed'],
      default: 'generating',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mystery', MysterySchema);
