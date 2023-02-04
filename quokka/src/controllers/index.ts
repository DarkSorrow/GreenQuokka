import { Web3Storage } from "web3.storage";
import Busboy from "busboy";
import { encrypt, decrypt } from "../medusa";
import {Duplex} from 'stream'; // Native Node Module 

const token = process.env.WEB3STORAGE_API_TOKEN;

const storage = new Web3Storage({ token });

function bufferToStream(myBuffer) {
    let tmp = new Duplex();
    tmp.push(myBuffer);
    tmp.push(null);
    return tmp;
}

export const uploadMedusa = (req, res) => {
  const buffers = [];
  const busboy = Busboy({ headers: req.headers });
  let cid;
  busboy.on("file", (fieldname, file, metadata, type) => {
    file.on("data", (data: any) => {
      buffers.push(data);
    });
    file.on("end", async () => {
      console.log(buffers.length);
      const concat = Buffer.concat(buffers);
      const data = new Uint8Array(concat.buffer);
      const buffer = Buffer.from(data);
      const all = await encrypt(data);      
      const { encryptedData, encryptedKey, cipherID } = all
      const encryptedBuffer = Buffer.from(encryptedData);
      const stream = bufferToStream(encryptedBuffer)
      // Hardcoded pdf
      cid = await storage.put([
        { name: "test.pdf", stream: () => stream },
      ] as any);
      await decrypt(cipherID)
    });
  });
  busboy.on("finish", () => {
    return;
  });
  req.pipe(busboy);
};
