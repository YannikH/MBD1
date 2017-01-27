cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "pluginId": "cordova-plugin-x-socialsharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/uk.co.workingedge.phonegap.plugin.launchnavigator/www/common.js",
        "id": "uk.co.workingedge.phonegap.plugin.launchnavigator.Common",
        "pluginId": "uk.co.workingedge.phonegap.plugin.launchnavigator",
        "clobbers": [
            "launchnavigator"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-x-socialsharing": "5.1.3",
    "cordova-plugin-geolocation": "2.4.1",
    "cordova-plugin-compat": "1.1.0",
    "uk.co.workingedge.phonegap.plugin.launchnavigator": "3.2.1",
    "cordova-plugin-whitelist": "1.3.1"
}
// BOTTOM OF METADATA
});