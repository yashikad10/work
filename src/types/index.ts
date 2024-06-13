export interface Inscription extends Document {
  [x: string]: any;
  wallet: string;
  data_uri: string;
  order_id: string;
  file_type: string;
  cardinal_address: string;
  ordinal_address: string;
  cardinal_pubkey: string;
  status: string;
  base64: string;
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

export interface IInscribeOrder {
  _id?: string;
  order_id: string;
  receive_address: string;
  chain_fee: number;
  service_fee: number;
  txid: string;
  psbt: string;
  status: "payment pending" | "payment received" | "inscribed" | "cancelled";
  inscriptionCount?: number;
  referrer?: string;
  referral_fee?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ICreateInscription extends IDoc {
  order_id: string;
  privkey: string;
  ordinal_address: string;
  file_type: string;
  base64: string;
  file_size: number;
  inscription_address: string;
  txid: string;
  leaf: string;
  tapkey: string;
  cblock: string;
  inscription_fee: number;
  inscription_id: string;
  network: "testnet" | "mainnet";
  status: string;
  fee_rate: number;
}

export interface IDoc {
  file_name: string;
  base64: string;
  cardinal_address: string;
  cardinal_pubkey: string;
  ordinal_address: string;
  ordinal_pubkey: string;
  wallet: string;
  order_id: string;
  status: string;
  fee_rate: number;
  inscription_fee?:number
}

export interface CreateInscription{
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
  created_at?: Date;
}