const express  = require('express');
const app = express();
const fs = require("fs");
const cors = require('cors');
const csvParser = require('csv-parser');
const { on } = require('events');
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 9898;


//All Columns of file
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

//All Columns of file
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

//Extracting single Column from file
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

//Extracting single Column from file
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
//Companywise Donation (Expected output format)
// app.get('/api/companyFunding', (req, res) => {
//   const result = {};

//   fs.createReadStream('ebpurchase.csv')
//     .pipe(csvParser())
//     .on('data', (row) => {
//       const companyName = row['Name of the Purchaser'];
//       const funding = parseFloat(row['Denominations']);

//       if (!result[companyName]) {
//         result[companyName] = 0;
//       }

//       result[companyName] += funding;
//     })
//     .on('end', () => {
//       res.json(result);
//     })
//     .on('error', (err) => {
//       console.error('Error reading CSV:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });
//Company wise Donation but Changed output format
app.get('/api/companyAmount', (req, res) => {
  const result = [];

  fs.createReadStream('ebpurchase.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      const companyName = row['Name of the Purchaser'];
      const funding = parseFloat(row['Denominations']);

      // Find the company in the result array
      let company = result.find((c) => c.Company === companyName);

      // If the company doesn't exist in the result array, create a new entry
      if (!company) {
        company = { Company: companyName, Amount: 0 };
        result.push(company);
      }

      // Add the funding to the company's total
      company.Amount += funding;
    })
    .on('end', () => {
      res.json(result);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//Companywise Donation (Expected output format)sorted
app.get('/api/companyFunding', (req, res) => {
  const result = {};

  fs.createReadStream('ebpurchase.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      const companyName = row['Name of the Purchaser'];
      const funding = parseFloat(row['Denominations']);

      if (!result[companyName]) {
        result[companyName] = 0;
      }

      result[companyName] += funding;
    })
    .on('end', () => {
      // Convert the result object to an array of entries
      const sortedEntries = Object.entries(result).sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedResult = Object.fromEntries(sortedEntries);

      res.json(sortedResult);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});




//testing api total party funding
app.get('/api/partyTotalFunding', (req, res) => {
  const result = [];

  fs.createReadStream('ecibond.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      // Log the row data for debugging
      console.log('Row data:', row);

      const extractedData = {
        'Name of the Political Party': row['Name of the Political Party'],
        'Denominations': row['Denominations'] // Add this line
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
//main api for total funding
// app.get('/api/partyFunding', (req, res) => {
//   const result = {};

//   fs.createReadStream('ecibond.csv')
//     .pipe(csvParser())
//     .on('data', (row) => {
//       // Log the row data for debugging
//       console.log('Row data:', row);

//       const partyName = row['Name of the Political Party'];
//       const funding = parseFloat(row['Denominations']);

//       // If the party is already in the result, add the funding to the existing total
//       // Otherwise, initialize the party in the result with the funding
//       if (result[partyName]) {
//         result[partyName] += funding;
//       } else {
//         result[partyName] = funding;
//       }
//     })
//     .on('end', () => {
//       // Log the final result for debugging
//       console.log('Extracted data:', result);

//       // Send the result as a JSON response
//       res.json(result);
//     })
//     .on('error', (err) => {
//       // Handle any errors during file reading or parsing
//       console.error('Error reading CSV:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// });



//sorted
app.get('/api/partyList', (req, res) => {
  const result = {};

  fs.createReadStream('ecibond.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      // Log the row data for debugging
      console.log('Row data:', row);

      const partyName = row['Name of the Political Party'];
      const funding = parseFloat(row['Denominations']);

      // If the party is already in the result, add the funding to the existing total
      // Otherwise, initialize the party in the result with the funding
      if (result[partyName]) {
        result[partyName] += funding;
      } else {
        result[partyName] = funding;
      }
    })
    .on('end', () => {
      // Log the final result for debugging
      console.log('Extracted data:', result);

      // Convert the result object to an array of entries
      const sortedEntries = Object.entries(result).sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedResult = Object.fromEntries(sortedEntries);

      // Send the sorted result as a JSON response
      res.json(sortedResult);
    })
    .on('error', (err) => {
      // Handle any errors during file reading or parsing
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});




//partywise donation from company

// app.get('/api/partywiseDonation', (req, res) => {
//   const partyName = req.query.partyName;
//     const bonds = {};
//     const purchasers = {};

//     // Read the ecibond.csv file
//     fs.createReadStream('ecibond.csv')
//         .pipe(csvParser())
//         .on('data', (row) => {
//             if (row['Name of the Political Party'] === partyName) {
//                 bonds[row['Bond Number']] = row;
//             }
//         })
//         .on('end', () => {
//             // Read the ebpurchase.csv file
//             fs.createReadStream('ebpurchase.csv')
//                 .pipe(csvParser())
//                 .on('data', (row) => {
//                     if (bonds[row['Bond Number']]) {
//                         if (!purchasers[row['Name of the Purchaser']]) {
//                             purchasers[row['Name of the Purchaser']] = 0;
//                         }
//                         purchasers[row['Name of the Purchaser']] += parseInt(row['Denominations']);
//                     }
//                 })
//                 .on('end', () => {
//                     res.json(purchasers);
//                 });
//         });
  
// });
app.get('/api/partywiseDonation', (req, res) => {
  const partyName = req.query.partyName;
  const bonds = {};
  const purchasers = {};
  const result = [];
  console.log(partyName);
  // Read the ecibond.csv file
  if (partyName && partyName !== undefined && partyName!== 'undefined') {
    console.log('in full');
    fs.createReadStream('ecibond.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        if (row['Name of the Political Party'] === partyName) {
          bonds[row['Bond Number']] = row;
        }
      })
      .on('end', () => {
        // Read the ebpurchase.csv file
        fs.createReadStream('ebpurchase.csv')
          .pipe(csvParser())
          .on('data', (row) => {
            if (bonds[row['Bond Number']]) {
              if (!purchasers[row['Name of the Purchaser']]) {
                purchasers[row['Name of the Purchaser']] = 0;
              }
              purchasers[row['Name of the Purchaser']] += parseInt(row['Denominations']);
            }
          })
          .on('end', () => {
            // Convert the purchasers object to an array of entries
            const sortedEntries = Object.entries(purchasers).sort((a, b) => b[1] - a[1]);
  
            // Convert the sorted array back into an object
            const sortedPurchasers = Object.fromEntries(sortedEntries);
  
            // Send the sorted result as a JSON response
            res.json(sortedPurchasers);
          });
      })
      .on('error', (err) => {
        // Handle any errors during file reading or parsing
        console.error('Error reading CSV:', err);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
  else{
    console.log('in half');
    fs.createReadStream('ebpurchase.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      const companyName = row['Name of the Purchaser'];
      const funding = parseFloat(row['Denominations']);

      if (!result[companyName]) {
        result[companyName] = 0;
      }

      result[companyName] += funding;
    })
    .on('end', () => {
      // Convert the result object to an array of entries
      const sortedEntries = Object.entries(result).sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedResult = Object.fromEntries(sortedEntries);

      res.json(sortedResult);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }
});


app.listen(port, () => {
  console.log(`Server chalu aahe ${port}`);
});