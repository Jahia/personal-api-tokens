// eslint-disable-next-line @typescript-eslint/no-var-requires
const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const codeCoverage = require('@cypress/code-coverage/task');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('./env');

module.exports = (on, config) => {
    env(on, config)
    codeCoverage(on, config);
    
    //https://github.com/archfz/cypress-terminal-report
    // eslint-disable-next-line @typescript-eslint/no-var-requires    
    installLogsPrinter(on);
    on("file:preprocessor", cypressTypeScriptPreprocessor);
    return config;
};