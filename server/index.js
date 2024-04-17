const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');

const { hexToBytes, toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  '02d6621fbb032d6c86a3c599e9106c7baab8a8bd55419ab1bd8a8cc9f9ef1af469': 100,
  '0266ccda0bcc3b951d4478bd1465504c0adcc72797a281c7670c2fd29cc65a63ff': 50,
  '020dda9ce27f767a38194d32b9ac9dc4bb4a3aa205b44f1f2ba7df862a718eb65f': 75
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { signature, senderPublicKey, intentMessageHash, amount, recipient } =
    req.body;
  let sig = JSON.parse(signature);
  sig.r = BigInt(sig.r);
  sig.s = BigInt(sig.s);

  if (!secp256k1.verify(sig, intentMessageHash, senderPublicKey)) {
    res.status(400).send({ message: `Invalid Transaction` });
  }

  const publicKeyBytes = hexToBytes(senderPublicKey);

  setInitialBalance(senderPublicKey);
  setInitialBalance(recipient);

  if (balances[senderPublicKey] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[senderPublicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderPublicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
