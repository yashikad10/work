export interface FileData extends Document {
  wallet: string;
  data_uri: string;
  order_id: string;
  file_type: string;
  cardinal_address: string;
  ordinal_address: string;
  cardinal_pubkey: string;
  status: string;
  inscription_address: string;
  txid: string;
  leaf: string;
  tapkey: string;
  cblock: string;
  inscription_fee: number;
  inscription_id: string;
  fee_rate: number;
  network: string;
  created_at: Date;
}