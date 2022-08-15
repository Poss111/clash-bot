module.exports.buildMessage = (template, data) => {
    if(!template || !data) {
        return {};
    }
    let stringTemplate = JSON.stringify(template);
    Object.entries(data).forEach((entry) => {
        stringTemplate = stringTemplate.replace(new RegExp(`:${entry[0]}`, 'g'), entry[1]);
    });
    return JSON.parse(stringTemplate);
};
