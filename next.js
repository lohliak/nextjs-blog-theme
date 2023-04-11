const express = require('express');
const axios = require('axios');
const cors = require('cors');

const multer = require('multer');
const upload = multer();

const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

const KNACK_APP_ID = '5c5befdd0c5efd2cb80d6ff2';
const KNACK_API_KEY = '1a66b8c9-00ec-4533-bc40-939f188f4bce';
//const KNACK_API_URL = 'https://api.knack.com/v1/objects/object_173'; // Replace 'object_ID' with the actual object ID from Knack

app.use(express.json());
app.use(cors());

// check server code is running or not
app.get('/api/check-server', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// Route to update a record in Knack
app.put('/api/knack-data/:objectId/:recordId', async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const recordId = req.params.recordId;
      const fieldId = req.body.fieldId;
      const fileId = req.body.fileId.id;

   //   const fileId = req.body.fileId.url;
 //     const fileId = req.body[fieldId];
const fileUrl = req.body.fileId.url;
const recordData = {
  [fieldId]: fileId
};


console.log('Received fileId:', fileId);
console.log('Received fieldId:', fieldId);
console.log('Received fileUrl:', fileUrl);
      
    const response = await 
    

    axios.put(`https://api.knack.com/v1/objects/${objectId}/records/${recordId}`, recordData, {
      headers: {
        'X-Knack-Application-ID': '5c5befdd0c5efd2cb80d6ff2',
        'X-Knack-REST-API-Key': '1a66b8c9-00ec-4533-bc40-939f188f4bce',
      },
    });
console.log('Record update response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Route to fetch data from Knack
app.get('/api/knack-data/:objectId/:recordId', async (req, res) => {
  try {
    const objectId = req.params.objectId;
    const recordId = req.params.recordId;

    const response = await axios.get(`https://api.knack.com/v1/objects/${objectId}/records/${recordId}`, {
      headers: {
        'X-Knack-Application-ID': '5c5befdd0c5efd2cb80d6ff2',
        'X-Knack-REST-API-Key': '1a66b8c9-00ec-4533-bc40-939f188f4bce',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Route to create or update a record in Knack
// Route to upload an image to Knack
const { Readable } = require('stream');



function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

app.post('/api/knack-upload', upload.single('files'), async (req, res) => {
  try {
    const file = req.file;

    // Create a new FormData instance and append the file
    const fileData = new FormData();
    

const fileBuffer = Buffer.from(file.buffer);
      

fileData.append('files', file.buffer, file.originalname);




console.log (fileData);
      
      
    // Axios request configuration for handling FormData
    const config = {
      headers: {
        'X-Knack-Application-ID': KNACK_APP_ID,
        'X-Knack-REST-API-Key': KNACK_API_KEY,
        'Content-Type': `multipart/form-data; boundary=${fileData._boundary}`,
      },
    };

    const response = await axios.post(
      `https://api.knack.com/v1/applications/${KNACK_APP_ID}/assets/image/upload`,
      fileData,
      config
    );

    console.log(`POST request sent to: https://api.knack.com/v1/applications/${KNACK_APP_ID}/assets/image/upload`);

    res.json(response.data);
  } 
    
    
 catch (error) {
  console.error('Error uploading image:', error.message);
  if (error.response) {
    console.error('Error response from Knack API:', error.response.data);
  } else {
    console.error('Error:', error);
  }
  res.status(500).json({ error: `Failed to upload image: ${error.message}` });
}

});





//POST part

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
