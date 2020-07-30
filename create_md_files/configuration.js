/* Production */
const configuration = {
    apiUrl: 'https://op.infra.lectio.cc/api/v3/',
    baseUrl: 'https://op.infra.lectio.cc',
    newsProjectId: 33,
    eventProjectId: 34,
    pressProjectId: 32,
    cleanUrlField: 'customField2',
    locationField: 'customField5',
	eventCancelledField: 'customField6',
    authToken: 'Basic YXBpa2V5OmJiYWQyY2I3NTQ5MTJkNDU1MzQ1ZDViOWE0ZGI3ZGVkYThjZGIyNTIzMGQ4ZDg1ZTc0MjRiOTJlNDg1YzlkODI='
};

/* Development */
/*const configuration = {
    apiUrl: 'https://openproject-devl.netspective.com/api/v3/',
    baseUrl: 'https://openproject-devl.netspective.com',
    newsProjectId: 9,
    eventProjectId: 10,
    pressProjectId: 11,
    cleanUrlField: 'customField8',
    locationField: 'customField11',
    authToken: 'Basic YXBpa2V5OmE5ZjMwNTg4NWRhZTc3NmNhZGM1OWI5ZDM0Yzc5NTRmNTA4M2IyZDRkNzhkZjU5YWYzOWRiMDI2ZjlmMzgxNGU='
};*/
module.exports = configuration;