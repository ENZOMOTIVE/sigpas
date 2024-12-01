// Assuming you're using Vite for frontend (client-side JS)
import axios from 'axios';
import FormData from 'form-data';

// Accessing environment variables from the .env file
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadToPinata = async (metadata: any) => {
  try {
    const data = JSON.stringify(metadata);
    const formData = new FormData();
    formData.append('file', data);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
    });

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};
