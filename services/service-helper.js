let getUrl = () => {
    if (!process.env.SERVICE_URL) {
        return 'http://localhost';
    } else {
        return process.env.SERVICE_URL;
    }
}

module.exports.getUrl = getUrl;
