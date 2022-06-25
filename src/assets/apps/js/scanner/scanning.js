var imagesScannedInCurrentScan = [];

/** Initiates a scan */

function scanWithoutAspriseDialog() {
    if (NumberOfTrialToConnectButHaseError > 20) {

        alert('Please Connect   Scanner App ');
    }
    scanner.scan(displayImagesOnPage,
        {
            "use_asprise_dialog": false,
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "jpg"
                }
            ]
        }
    );
}

/** Processes the scan result */
function displayImagesOnPage(successful, mesg, response) {
    if (!successful) { // On error
        console.error('Failed: ' + mesg);
        return;
    }

    if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) { // User cancelled.
        console.info('User cancelled');
        return;
    }
    document.getElementById('scanned_images').innerHTML = '';
    imagesScannedInCurrentScan = [];
    var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
    for (var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
        var scannedImage = scannedImages[i];
        processScannedImage(scannedImage);
    }

}


/** Processes a ScannedImage */
function processScannedImage(scannedImage) {
    imagesScannedInCurrentScan.push(scannedImage);
    var elementImg = scanner.createDomElementFromModel({
        'name': 'img',
        'attributes': {
            'class': 'scanned',
            'src': scannedImage.src
        }
    });
    document.getElementById('scanned_images').appendChild(elementImg);
}
