README

Photos Api Exposes An Endpoint with Route "/photo/get/{Place Name}/{Amount (1 - 5)/Width/Height}"

It Returns A List Urls THat Point To Images Served By Google 

Its An Extension For Recieving Images Of Locations That where Retrieved Through Amadeus Self service Api.

This Program Has Been Configured For Use Within Kubernetes And Uses API_KEY env variable setup For The Photoapi Pod. 

SSL certificates Setup Within the kubernetes Environment are Also Used for Setting Up Https server 