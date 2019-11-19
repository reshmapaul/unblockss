const request = require('request');
const CONFIGURATION = require('./configuration');
const fs = require('fs');

function getRequest(options, json = true) {

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                if (json) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(body);
                }
            }
        })
    })
}

function main() {
    // Setting URL and headers for request
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': CONFIGURATION.authToken
    }
    const options = {
        url: CONFIGURATION.apiUrl + 'projects/3/work_packages',
        method: 'GET',
        headers: headers,
    }
    const getWorkPackageCount = getRequest(options);
    getWorkPackageCount.then(function (response) {
        const totalWorkPackages = response.total;
        let totalLength = Number(totalWorkPackages) / 50;
        totalLength = Math.trunc(totalLength) + 1;
        let total = totalWorkPackages;
        let offset = 0;
        // totalLength = Number(totalLength) + 1;
        for (let i = 0; i < totalLength; i++) {
            if (i === 0) {
                offset = 0;
            } else {
                offset = (Number(i) * 50);
            }
            if (i === Number(totalLength - 1)) {
                options.url = CONFIGURATION.apiUrl + 'projects/3/work_packages?offset=' + offset + '&pageSize=' + total;
            } else {
                total = total - 50;
                options.url = CONFIGURATION.apiUrl + 'projects/3/work_packages?offset=' + offset + '&pageSize=' + 50;
            }
            const getWorkPackages = getRequest(options);
            getWorkPackages.then(function (result) {
                workPackages = result['_embedded']['elements'];
                workPackages.forEach(function (item) {
                    if (item['_links']['attachments']) {
                        let mdContent = '';
                        mdContent = "+++ \ntitle = " + '"' + item['subject'] + '"' + "\ncleanUrl = " + '"' + item['customField8'] + "" + '"' + "\ncreatedAt = " + '"' + item['createdAt'] + "" + '"' + "\n";
                        let attachMentUrl = item['_links']['attachments']['href'];
                        attachMentUrl = CONFIGURATION.baseUrl + attachMentUrl;
                        options.url = attachMentUrl;
                        const getAttachments = getRequest(options);
                        getAttachments.then(function (response) {
                            if (response['_embedded']['elements'].length > 0) {
                                const elements = response['_embedded']['elements'];
                                contentUrl = '';
                                elements.some(function (attachment, index, _arr) {
                                    if (attachment['_links']['self']['title']) {
                                        if (attachment['_links']['self']['title'] === 'Curated_Featured_Image.png') {
                                            contentUrl = attachment['_links']['self']['href'];
                                            contentUrl = CONFIGURATION.baseUrl + contentUrl + '/content';
                                            return false;
                                        }
                                    }
                                });
                                if (contentUrl !== '') {
                                    options.url = contentUrl;
                                    options['encoding'] = 'binary';
                                    const getAttachmentContents = getRequest(options, false);
                                    getAttachmentContents.then(function (responseData) {
                                        let fileName = item['subject'].replace(/[^a-zA-Z ]/g, "");
                                        fileName = fileName.replace(/ /g, '');
                                        fileName = fileName + '.png';
                                        imagePath = "../images/resources/" + fileName;
                                        mdContent = mdContent + "banner = " + '"' + imagePath + '"' + "\n";
                                        fs.writeFile("../static/images/resources/" + fileName, responseData, 'binary', function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log("The file was saved!");
                                            }
                                        });
                                        const mdFileName = item['subject'].replace(/[^a-zA-Z ]/g, "");
                                        mdContent = mdContent + "+++\n" + item['description']['raw'] + "\n";
                                        fs.writeFile('../content/breif/' + mdFileName + '.md', mdContent, function (err) {
                                            if (err) throw err;
                                            console.log('Saved successfully!');
                                        });
                                    });
                                }
                            }
                        });
                    }
                });
            },function (err) {
                console.log(err);
            });
        }

    }, function (err) {
        console.log(err);
    })
}

main();