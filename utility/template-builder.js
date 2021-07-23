module.exports.buildMessage = (template, data) => {
    if(!template || !data) {
        return {};
    }
    let stringTemplate = JSON.stringify(template);
    Object.entries(data).forEach((entry) => {
        stringTemplate = stringTemplate.replace(`:${entry[0]}`, entry[1]);
    });
    return JSON.parse(stringTemplate);
}
