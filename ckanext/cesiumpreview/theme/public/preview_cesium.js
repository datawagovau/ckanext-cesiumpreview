// json preview module
ckan.module('cesiumpreview', function (jQuery, _) {
    return {
        initialize: function () {
            var self = this;

            var vis_server = 'http://internal-map.dpaw.wa.gov.au/';
//            var vis_server = 'https://nationalmap.gov.au/';

            var config = {
                "version": "0.0.05",
                "initSources": [{
                    "catalog": [{
                        "type": "group",
                        "name": "User-Added Data",
                        "description": "The group for data that was added by the user via the Add Data panel.",
                        "isUserSupplied": true,
                        "isOpen": true,
                        "items": [{
                            "type": "kml",
                            "name": "User Data",
                            "isUserSupplied": true,
                            "isOpen": true,
                            "isEnabled": true,
                            "url": "http://"
                        }]
                    }],
                    "catalogIsUserSupplied": true,
                    "homeCamera": {
                        "west": 105,
                        "south": -45,
                        "east": 130,
                        "north": -5
                    }

                }
                ]

            };
            // load dataset spatial extent as default home camera if available
            if (spatial != '') {
                extent = geojsonExtent(JSON.parse(spatial)); //[WSEN]
                if (extent[0] != extent[2]) {
                    config["initSources"][0]['homeCamera']['west'] = extent[0];
                    config["initSources"][0]['homeCamera']['south'] = extent[1];
                    config["initSources"][0]['homeCamera']['east'] = extent[2];
                    config["initSources"][0]['homeCamera']['north'] = extent[3];
                }
            }

            config["initSources"][0]['catalog'][0]['items'][0]['url'] = preload_resource['url'];
                if (preload_resource['url'].indexOf('http') !== 0) {
                    config["initSources"][0]['catalog'][0]['items'][0]['url'] = "http:" + preload_resource['url'];
                }
            if (preload_resource['wms_url']) {
                config["initSources"][0]['catalog'][0]['items'][0]['url'] = preload_resource['wms_url'];
            }
            config["initSources"][0]['catalog'][0]['items'][0]['type'] = preload_resource['format'].toLowerCase();

            if (config["initSources"][0]['catalog'][0]['items'][0]['type'] == 'wms' || config["initSources"][0]['catalog'][0]['items'][0]['type'] == 'wfs') {
                // if wms_layer specified in resource, display that layer/layers by default
                if (typeof preload_resource['wms_layer'] != 'undefined' && preload_resource['wms_layer'] != '') {
                    config["initSources"][0]['catalog'][0]['items'][0]['layers'] = preload_resource['wms_layer'];
                }
                else {
                    config["initSources"][0]['catalog'][0]['items'][0]['type'] = config["initSources"][0]['catalog'][0]['items'][0]['type'] + '-getCapabilities';
                }
            }
            if (config["initSources"][0]['catalog'][0]['items'][0]['type'] == 'aus-geo-csv' || config["initSources"][0]['catalog'][0]['items'][0]['type'] == 'csv-geo-au') {
                config["initSources"][0]['catalog'][0]['items'][0]['type'] = 'csv';
            }
            var encoded_config = encodeURIComponent(JSON.stringify(config));
            var style = 'height: 600px; width: 100%; border: none;';
            var display = 'allowFullScreen mozAllowFullScreen webkitAllowFullScreen';
            var src = vis_server + '#clean&hideExplorerPanel=1&start=' + encoded_config
            var btn = '<div><a id="cesium-fullscreen" type="button" class="btn btn-warning" href="' + src + 
                  '" title="Open map full-screen in a new tab" target="_"' + 
              '><i class="icon-fullscreen"></i>View Map Full-Screen</a></div>'
            var map = '<iframe src="' + src  + '" style="' + style + '" ' + display + '></iframe>';
            var html = btn + map


            console.log(html);

            self.el.html(html);
        }
    };
});
