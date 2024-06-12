import { Tap, Script, Address, Signer, Tx } from "@cmdcode/tapscript";
import * as cryptoTools from "@cmdcode/crypto-tools";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import FileData from "@/models/FileData";
const PREFIX = 160;

function bytesToHex(bytes: Uint8Array): string {
  return Array.prototype.map.call(bytes, (byte: number) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

 async function generatePrivateKey(): Promise<string> {
  let isValid = false;
  let privkey;
  while (!isValid) {
    privkey = bytesToHex(cryptoTools.noble.secp.utils.randomPrivateKey());
    let seckey = cryptoTools.keys.get_seckey(privkey);
    let pubkey = cryptoTools.keys.get_pubkey(seckey);
    const init_script = [pubkey, "OP_CHECKSIG"];
    let init_leaf = await Tap.tree.getLeaf(Script.encode(init_script));
    let [init_tapkey, init_cblock] = await Tap.getPubKey(pubkey, {
      target: init_leaf,
    });

    const test_redeemtx = Tx.create({
      vin: [
        {
          txid: "a99d1112bcb35845fd44e703ef2c611f0360dd2bb28927625dbc13eab58cd968",
          vout: 0,
          prevout: {
            value: 10000,
            scriptPubKey: ["OP_1", init_tapkey],
          },
        },
      ],
      vout: [
        {
          value: 8000,
          scriptPubKey: ["OP_1", init_tapkey],
        },
      ],
    });
    const test_sig = await Signer.taproot.sign(seckey.raw, test_redeemtx, 0, {
      extension: init_leaf,
    });
    test_redeemtx.vin[0].witness = [test_sig.hex, init_script, init_cblock];
    isValid = await Signer.taproot.verify(test_redeemtx, 0, { pubkey });
    if (!isValid) {
      console.log("Invalid key generated, retrying...");
    } else {
      console.log({ privkey });
    }
  }
  if (!privkey) {
    throw Error("No privkey was generated");
  }
  return privkey;
}

 async function processInscriptions(order_id: string, file: any, fee_rate: number, network: "testnet"| "mainnet") {
  const ec = new TextEncoder();

  const dataURL = file && file.dataURL ? file.dataURL : null;
  if (!dataURL) {
    throw new Error('File dataURL is missing');
  }

  const privkey = await generatePrivateKey();
  const seckey = cryptoTools.keys.get_seckey(privkey);
  const pubkey = cryptoTools.keys.get_pubkey(seckey);
  
  const mimetype = file && file.type ? file.type : "text/plain;charset=utf-8";

  const script = [
    pubkey,
    "OP_CHECKSIG",
    "OP_0",
    "OP_IF",
    ec.encode("ord"),
    "01",
    ec.encode(mimetype),
    "OP_0",
    ec.encode(dataURL), 
    "OP_ENDIF",
  ];
  
  const leaf = Tap.tree.getLeaf(Script.encode(script));
  const [tapkey, cblock] = Tap.getPubKey(pubkey, { target: leaf });
  
  let inscriptionAddress = Address.p2tr.encode(tapkey, network );
  console.debug("Inscription address: ", inscriptionAddress);
  console.debug("Tapkey:", tapkey);
  
  let txsize = PREFIX + Math.floor(dataURL.length / 4);
  let inscription_fee = fee_rate * txsize;

  const inscriptions = {
    file_type: file.type,
    data_uri: dataURL,
    order_id,
    leaf: leaf,
    tapkey: tapkey,
    cblock: cblock,
    inscription_address: inscriptionAddress,
    inscription_fee,
    fee_rate,
    network
  };

  console.log('inscriptions', inscriptions);

  return inscriptions;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { imageInfo, dataURL, cardinal_address, ordinal_address, cardinal_pubkey, wallet } = data;
    const order_id = uuidv4();

    console.log({imageInfo});

    if (!imageInfo || !imageInfo.dataURL) {
      throw new Error('Image dataURL is missing');
    }

    const processInscriptionsData = await processInscriptions(order_id, imageInfo, 198, "testnet");
    const dataToSave = {
      ...processInscriptionsData,
      cardinal_address,
      ordinal_address,
      cardinal_pubkey,
      wallet,
    };

    console.log("-----------------data--------------",dataToSave)

    await dbConnect();
    await FileData.create(dataToSave)
    console.log(dataToSave);
    return NextResponse.json({ message: 'Image data saved successfully' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'SERVER ERROR' }, { status: 500 });
  }
}


export const config = {
  api: {
    runtime: 'edge',
  },
};



