const express  = require('express');
const app = express();
const fs = require("fs");
const csvParser = require('csv-parser');
const { on } = require('events');
app.use(express.json());


const port = process.env.PORT || 9898;
app.get('/api/eci',(req,res) =>{
    const result = [];

    fs.createReadStream('ecibond.csv')
      .pipe(csvParser())
      .on('data',(row) => {
        result.push(row);
      })
      .on('end',() => {
        res.json(result);
      });


});

app.get('/api/ebpurchase',(req,res) =>{
  const result = [];

  fs.createReadStream('ebpurchase.csv')
    .pipe(csvParser())
    .on('data',(row) => {
      result.push(row);
    })
    .on('end',() => {
      res.json(result);
    });


});
app.get('/api/party', (req, res) => {
  const result = [];

  fs.createReadStream('ecibond.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      // Log the row data for debugging
      console.log('Row data:', row);

      const extractedData = {
        'Name of the Political Party': row['Name of the Political Party']
        // Add other relevant fields here if needed
      };
      result.push(extractedData);
    })
    .on('end', () => {
      // Log the final result for debugging
      console.log('Extracted data:', result);

      // Send the result as a JSON response
      res.json(result);
    })
    .on('error', (err) => {
      // Handle any errors during file reading or parsing
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.get('/api/donar', (req, res) => {
  const result = [];

  fs.createReadStream('ebpurchase.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      // Log the row data for debugging
      console.log('Row data:', row);

      const extractedData = {
        'Name of the Purchaser' : row['Name of the Purchaser']
        // Add other relevant fields here if needed
      };
      result.push(extractedData);
    })
    .on('end', () => {
      // Log the final result for debugging
      console.log('Extracted data:', result);

      // Send the result as a JSON response
      res.json(result);
    })
    .on('error', (err) => {
      // Handle any errors during file reading or parsing
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
app.listen(port, () => {
  console.log(`Server chalu aahe ${port}`);
});