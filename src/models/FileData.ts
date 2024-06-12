
import { Schema, model, models, Document } from 'mongoose';

import { FileData } from '@/types';

const FileDataSchema = new Schema<FileData>({
  wallet: {
    type: String,
    required: true
  },
  data_uri: {
    type: String,
    required: true
  },
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  file_type: {
    type: String,
    required: true
  },
  cardinal_address: {
    type: String,
    required: true
  },
  ordinal_address: {
    type: String,
    required: true
  },
  cardinal_pubkey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  inscription_address: {
    type: String,
    required: true,
  },
  txid: {
    type: String,
    required: false,
  },
  leaf: {
    type: String,
    required: true,
  },
  tapkey: {
    type: String,
    required: true,
  },
  cblock: {
    type: String,
    required: true,
  },
  inscription_fee: {
    type: Number,
    required: true,
  },
  inscription_id: {
    type: String,
    required: false,
  },
  fee_rate: {
    type: Number,
    required: true,
  },
  network: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default models.FileData|| model<FileData>('FileData', FileDataSchema);
