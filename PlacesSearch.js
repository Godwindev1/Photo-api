const axios =  require('axios');
const { json } = require('express');

const dotenv =  require('dotenv');

dotenv.config();

let api_key = process.env.API_KEY;

class AuthurAttributions
    {
        constructor(name, URI, ImageURI)
        {
            this.MapsURI = URI;
            this.displayname = name;
            this.imageURI = ImageURI;
        }

        displayname;
        imageURI;
        MapsURI;
    }

class photos{
    constructor(name, widthPx, heightPx, flagContentUri, googleMapsUri, authurattribs) {
        this.name = name; 
        this.widthPx = widthPx;
        this.heightPx = heightPx;
        this.flagContentUri = flagContentUri;
        this.googleMapsUri = googleMapsUri;
        this.authurAttributions = authurattribs;
      }

    name;
    widthPx;
    heightPx;
    flagContentUri;
    googleMapsUri;
    authurAttributions;
}

async function  GetPlaceID(PlaceName)
{
    const QueryData = {
        "textQuery": PlaceName
    }

    const Config = 
    {
        headers: {
            'content-type': 'application/json',
            'X-Goog-Api-Key': `${api_key}`,
            'X-Goog-FieldMask': 'places.id'
         }
    }

    const URL = 'https://places.googleapis.com/v1/places:searchText';
    let Results = await axios.post(URL, QueryData, Config).catch(
        (error) => {
            console.error('Error fetching data:', error);
        }
    );
   
    let JsonRes = JSON.stringify(Results.data);
    let FinalRes = JSON.parse(JsonRes);
    

    return  FinalRes.places[0].id;   

}

function ParseImageResourceNames(arrayofphotos)
{
    let arrURIs = [];
    
    arrayofphotos.forEach( (element, i) => {
        arrURIs[i] = element.name;
    } );


    return arrURIs;
}



async function GetImageRequest(ResourceName, imagewidth, imageHieght)
{
    const URL = `https://places.googleapis.com/v1/${ResourceName}/media?key=${api_key}&maxHeightPx=${imagewidth}&maxWidthPx=${imageHieght}&skipHttpRedirect=${true}`;

    let Results = await axios.get(URL).catch(
        (error) => {
           console.error('Error fetching data:', error);
           console.log("url:  " + URL + "\n");
        }
    );

    return Results.data;
}


async function GetImageURLsFromResourceName(ArrayOfResourceNames, imagewidth, ImageHieght)
{
    let arrayofimageUrls = [];

    for( let [index, element] of ArrayOfResourceNames.entries() )
    {
        arrayofimageUrls[index] =  await GetImageRequest(element, imagewidth, ImageHieght);
    }


    return arrayofimageUrls;
}


 async function GetPlacePhotos(PlaceName, AmountPhotos, imageWidth = 400, ImageHieght = 400)
{
    let ID = await GetPlaceID(PlaceName);
    console.log(ID); 

    const QueryData = {
    }

    const Config = 
    {
        headers: {
            'content-type': 'application/json',
            'X-Goog-Api-Key': `${api_key}`,
            'X-Goog-FieldMask': 'photos'
         }
    }

    const URL = `https://places.googleapis.com/v1/places/${ID}`;
    console.log(URL);

    let Results = await axios.get(URL, Config).catch(
        (error) => {
            console.error('Error fetching data:', error);
        }
    );

    let ArrOfPhotoResourceNames =  [];

    Results.data.photos.forEach( (element, i) => {
        if (i >= AmountPhotos)
        {
            return;
        }

        //Arrange authurattributions
        let ArrayOfAuthurAttribs = [];

        
        element.authorAttributions.forEach ( (AuthurElement, i) => {
           ArrayOfAuthurAttribs[i] = new AuthurAttributions(AuthurElement.displayname, AuthurElement.uri, AuthurElement.photoUri);
        });


        ArrOfPhotoResourceNames[i] = new photos(element.name, element.widthPx,
         element.heightPx, element.flagContentUri, element.googleMapsUri, ArrayOfAuthurAttribs) ;
    });


    let arrOfResourceNames = ParseImageResourceNames(ArrOfPhotoResourceNames);
    let ReturnedURLS = await GetImageURLsFromResourceName(arrOfResourceNames, imageWidth, ImageHieght);

    return ReturnedURLS;
;
}

module.exports = {
    GetPlaceID, GetPlacePhotos, GetImageRequest
}