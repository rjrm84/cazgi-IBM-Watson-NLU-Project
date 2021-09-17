const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    const api_key = process.env.API_KEY;
    const api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}
//DECLARATION PORTION END


// ENDPOINTS START
//The default endpoint for the webserver
app.get("/",(_req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
 
const analyzeParams = {
 "url": req.query.url,
 "features": {
 "entities": {
 "emotion": true,
 "sentiment": true,
 "limit": 1
 },
 "keywords": {
 "emotion": true,
 "sentiment": true,
 "limit": 1
 }
 }
 }
 
 const naturalLanguageUnderstanding = getNLUInstance();
 
 naturalLanguageUnderstanding.analyze(analyzeParams)
 .then(analysisResults => {
 console.log(analysisResults);
 console.log(JSON.stringify(analysisResults.result.keywords[0].emotion,null,2));
 return res.send(analysisResults.result.keywords[0].emotion,null,2);
 })
 .catch(err => {
 return res.send("Could not do desired operation "+err);
 });
});


//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
 const analyzeParams = {
 "text": req.query.text,
 "features": {
 "entities": {
 "emotion": true,
 "sentiment": true,
 "limit": 1
 },
 "keywords": {
 "emotion": true,
 "sentiment": true,
 "limit": 1
 }
 }
 }
 
 const naturalLanguageUnderstanding = getNLUInstance();
 
 naturalLanguageUnderstanding.analyze(analyzeParams)
 .then(analysisResults => {
 console.log(analysisResults);
 //console.log(JSON.stringify(analysisResults.result.entities[0].emotion,null,2));
return res.send(analysisResults.result.keywords[0].emotion,null,2);
 //return res.send(analysisResults);
 })
 .catch(err => {
 return res.send("Could not do desired operation "+err);
 });
 
});
let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})


// function getNLUInstance() {
//     const api_key = process.env.API_KEY;
//     const api_url = process.env.API_URL;

//     const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
//     const { IamAuthenticator } = require('ibm-watson/auth');

// const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
//   version: '2021-08-01',
//   authenticator: new IamAuthenticator({
//     apikey: api_key,
//   }),
//   serviceUrl: api_url,
// });

// const analyzeParams = {
//   'url': 'www.ibm.com',
//   'features': {
//     'categories': {
//       'limit': 3
//     }
//   }
// };

// naturalLanguageUnderstanding.analyze(analyzeParams)
//   .then(analysisResults => {
//     console.log(JSON.stringify(analysisResults, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });
// }


// //The default endpoint for the webserver
// app.getNLUInstance("/",(_req,res)=>{
//     res.render('index.html');
//   });

// //The endpoint for the webserver ending with /url/emotion
// app.getNLUInstance("/url/emotion", (req,res) => {
//     //Extract the url passed from the client through the request object
//     let urlToAnalyze = req.query.url
//     const analyzeParams = 
//         {
//             "url": urlToAnalyze,
//             "features": {
//                 "keywords": {
//                                 "emotion": true,
//                                 "limit": 1
//                             }
//             }
//         }
     
//      const naturalLanguageUnderstanding = getNLUInstance();
     
//      naturalLanguageUnderstanding.analyze(analyzeParams)
//      .then(analysisResults => {
//         //Print the JSON returned by NLU instance as a formatted string
//         console.log(JSON.stringify(analysisResults.result.keywords[0].emotion,null,2));
//         //Please refer to the image to see the order of retrieval
//         return res.send(analysisResults.result.keywords[0].emotion,null,2);
//      })
//      .catch(err => {
//      return res.send("Could not do desired operation "+err);
//      });
// });

// //The endpoint for the webserver ending with /url/sentiment
// app.getNLUInstance("/url/sentiment", (req,res) => {
//     return res.send("url sentiment for "+req.query.url);
// });

// //The endpoint for the webserver ending with /text/emotion
// app.getNLUInstance("/text/emotion", (_req,res) => {
//     return res.send({"happy":"10","sad":"90"});
// });

// app.getNLUInstance("/text/sentiment", (req,res) => {
//     return res.send("text sentiment for "+req.query.text);
// });

// let server = app.listen(8080, () => {
//     console.log('Listening', server.address().port)
// })