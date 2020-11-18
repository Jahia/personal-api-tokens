// eslint-disable-next-line @typescript-eslint/no-var-requires
const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor");

module.exports = (on, config) => {
    on('task', {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        failed: require('cypress-failed-log/src/failed')(),
      })
    if (config.env.COVERAGE){
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require("@cypress/code-coverage/task")(on, config);
    }
    on("file:preprocessor", cypressTypeScriptPreprocessor);
    return config;
};