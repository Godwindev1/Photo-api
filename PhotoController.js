const { GetPlacePhotos, GetPlaceID, GetImageRequest }  = require( './PlacesSearch.js' );
const express = require( 'express' );
const { body, param, query, validationResult } = require('express-validator')

let router = express.Router();

router.get('/Get/:name/:amount/:width/:height', 
    [
        param('name').isString().notEmpty(),
        param('amount').isInt({min: 1, max: 6}).withMessage('count must Be A positive Integer between 1 and 6'),
        param('width').isInt(),
        param('height').isInt()
    ],
    
   async (req, res) => {
    console.log("attempting Get Request");
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let name = req.params.name;
    let amount = req.params.amount;
    let width = req.params.width;
    let height = req.params.height;


    let result = await GetPlacePhotos(name, amount, width, height);
    
    if(result != null)
    {
        res.status(200).send( JSON.stringify(result) );
    }
    else{
        res.status(500).send('{ error: Internal Server Error }');
    }

});


router.get("/Image/:width/:height", 
    [
        param('width').isInt(),
        param('height').isInt(),
        query('resourcename').isString().notEmpty()
    ]

    ,
    async (req, res) => {
    console.log("attempting Image Request");
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let name = req.query.resourcename;
    let width = req.params.width;
    let height = req.params.height;

    let results = await GetImageRequest(name, width, height);
    console.log(results);

    if(results != null)
    {
        res.status(200).send( JSON.stringify(results) );
    }
    else{
        res.status(500).send('{ error: Internal Server Error  }');
    }

}
);

module.exports = router;