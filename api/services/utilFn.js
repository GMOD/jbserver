var fs = require('fs-extra');
var approot = require('app-root-path');
var merge = require('deepmerge');

module.exports = {
    /*
     * returns the config, merged with the contents of jbconnect.config.js
     */
    mergeConfigJs(config) {
        // merge approot/jbconnect.config.js
        let config_js = approot+"/jbconnect.config.js";
        if (fs.existsSync(config_js)) {
            let conf = require(config_js);
            config = merge(config,conf);
        }
        return config;
    },
    /*
     * return true or false
     */
    jbrowseInstalled(config) {
        
        
    }
};