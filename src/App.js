import './App.css';
import Web3 from 'web3';

import React, { useEffect, useState } from 'react';

import PhotoSharing from './build/contracts/PhotoSharing.json';

function App() {

  const loadWeb3 = async() => {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable(); 
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Install MetaMask');
    }

  }

  const [account, setAccount] = useState('');
  const [photoSharing, setPhotoSharing] = useState(null); 
  const [loading, setLoading] = useState(true);

  const loadBlockchain = async () => {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts(); 
    setAccount(account[0]);

    const networkId = await web3.eth.net.getId(); 

    const networkData = PhotoSharing.networks[networkId]; 

    if (networkData) {

      const photoSharing = new web3.eth.Contract(
        PhotoSharing.abi, networkData.address 
      );

      setPhotoSharing(photoSharing);

      setLoading(false);

    } else {
      window.alert('Photo Sharing contract not deployed to that network.');
    }
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchain();
  });

  return (
    <div >

      { loading ? (
        <p>Loading </p>
      ) : (
        <p>Loaded</p>
      )}     

    </div>
  );
}

export default App;
