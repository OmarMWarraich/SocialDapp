import './App.css';
import Web3 from 'web3';
import React, { useEffect, useState } from 'react';

import PhotoSharing from './build/contracts/PhotoSharing.json';
import AddPost from './components/AddPost';
import Posts from './components/Posts';

import {create} from 'ipfs-http-client';
import { Buffer } from 'buffer';

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
  const [images, setImages] = useState([]);

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

      const imageLength = await photoSharing.methods.imageCount().call();

      for (let i = 0; i <= imageLength; i++) {
        const image = await photoSharing.methods.images(i).call();

        if (image.hash !== '') {
          setImages((previous) => [...previous, image]);
        }
      }
      setLoading(false);
    } else {
      window.alert('Photo Sharing contract not deployed to that network.');
    }
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchain();
  }, []);

  const [bufferImage, setBufferImage] = useState(null);

  let bufferedImage;

  const captureFile = (event) => {

    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      bufferedImage = await Buffer(reader.result);
      setBufferImage(bufferedImage);
    }
  }

  const projectId = process.env.REACT_APP_PROJECT_ID;
  const apiKey = process.env.REACT_APP_API_KEY;

  const auth = 'Basic ' + Buffer.from(projectId + ':' + apiKey).toString('base64');

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers : {
      authorization: auth,
    },
  })

  const uploadImage = async (description) => {
    try {

      setLoading(true);

      const createdImage = await client.add(bufferImage);
      const url = `https://ipfs.infura.io/ipfs/${createdImage.path}`;

      await photoSharing.methods.uploadImage(createdImage.path, description).send({ from: account });

      setLoading(false);

      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  }

  const likePost = async (id, amountOfLikesToAdd) => {
    try {
      setLoading(true);

      await photoSharing.methods.likePost(id).send({ from: account, value: 1 });

      setLoading(false);

      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  }
      

  return (
    <div >

      { loading ? (
        <p>Loading </p>
      ) : (
        <>
        <p>Loaded</p>
        <AddPost uploadImage={uploadImage} captureFile={captureFile} />
        <Posts posts={images} likePost = {likePost} />
        </>
      )}     

    </div>
  );
}

export default App;
