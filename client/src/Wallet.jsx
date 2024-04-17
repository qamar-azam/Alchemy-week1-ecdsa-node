import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey
}) {
  // async function onChange(evt) {
  //   const address = evt.target.value;
  //   const privateKey = evt.target.value;

  //   setPrivateKey(privateKey);
  //   setAddress(address);

  //   if (address) {
  //     const {
  //       data: { balance }
  //     } = await server.get(`balance/${address}`);
  //     setBalance(balance);
  //   } else {
  //     setBalance(0);
  //   }
  // }

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    const publicKeyHex = toHex(publicKey);
    setAddress(publicKeyHex);

    console.log(address, 'address');

    // const ethAddress = toHex(keccak256(publicKey.slice(1)).slice(-20));
    // setEthAddress(ethAddress);

    if (address) {
      const {
        data: { balance }
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder='Type an address, for example: 0x1'
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder='Type an private key'
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
