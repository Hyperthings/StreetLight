"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var ajax_service_1 = require("./../shared/services/ajax.service");
var variables_service_1 = require("./../shared/services/variables.service");
var MapComponent = /** @class */ (function () {
    function MapComponent(ajaxService, zone, variablesService, router) {
        this.ajaxService = ajaxService;
        this.zone = zone;
        this.variablesService = variablesService;
        this.router = router;
        this.markers = [];
    }
    MapComponent.prototype.ngOnInit = function () {
    };
    MapComponent.prototype.ngOnChanges = function (changes) {
        var that = this;
        console.log(this.overallSiteDevices);
        var mapProp = {
            center: new google.maps.LatLng(12.914619, 77.632726),
            zoom: 10,
            streetViewControl: true
        };
        var map = new google.maps.Map(document.getElementById("map"), mapProp);
        this.map = map;
        var overlay;
        CustomOverlay.prototype = new google.maps.OverlayView();
        function CustomOverlay(map, content, position, gaugeValue, drawGauge) {
            this.map_ = map;
            this.div_ = null;
            this.contentString = content;
            this.drawGauge = drawGauge;
            this.overlayPosition = position;
            this.gaugeValue = gaugeValue;
            this.setMap(map);
        }
        CustomOverlay.prototype.onAdd = function () {
            var div = document.createElement('div');
            div.id = "customOverlay";
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';
            div.innerHTML = this.contentString;
            this.div_ = div;
            var panes = this.getPanes();
            panes.overlayLayer.style['zIndex'] = 1001;
            //panes.overlayLayer.appendChild(div);
            panes.overlayMouseTarget.appendChild(div);
            var drawGauge = this.drawGauge;
            var gaugeValue = this.gaugeValue;
            setTimeout(function () {
                drawGauge("gaugeContainer", gaugeValue);
            }, 500);
            var deviceDiv = document.getElementById('thisDevice');
            google.maps.event.addDomListener(deviceDiv, 'click', function () {
                that.variablesService.selctedSiteName = that.siteName;
                that.variablesService.selctedDeviceName = that.deviceId;
                that.variablesService.selctedDeviceDisplayName = that.deviceName;
                that.router.navigate(['/energy-index']);
            });
            var closeDiv = document.getElementById('closeOverlay');
            google.maps.event.addDomListener(closeDiv, 'click', function () {
                //this.div_.parentNode.removeChild(this.div_);
                //this.div_ = null;
                div.setAttribute("style", "display:none");
            });
        };
        CustomOverlay.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var point = overlayProjection.fromLatLngToDivPixel(this.overlayPosition);
            console.log(point);
            var div = this.div_;
            div.style.left = point.x + 'px';
            div.style.top = point.y + 'px';
            /*div.style.width =  '150px';
            div.style.height =  '150px';
            div.style.background='red';
    */ 
        };
        CustomOverlay.prototype.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        };
        CustomOverlay.prototype.toggleDOM = function () {
            if (this.getMap()) {
                // Note: setMap(null) calls OverlayView.onRemove()
                this.setMap(null);
            }
            else {
                this.setMap(this.map_);
            }
        };
        if (changes["objects"]) {
            var tempList = changes["objects"].currentValue;
            var iconBase = './assets/images/map_icons/20/';
            if (tempList) {
                var _loop_1 = function (device) {
                    console.log("DEV List", device);
                    /*let markerImage=iconBase + device._id.solution + ".png";
                    let tempLatLng = {lat: device._id.latitude, lng: device._id.longitude};*/
                    var markerImage = iconBase + device.solution + ".png";
                    var tempLatLng = { lat: Number(device.latitude), lng: Number(device.longitude) };
                    tmpContent = "";
                    gaugeValue = 0;
                    if (device._id.solution == "SmartBuilding") {
                        gaugeValue = device.energySavings;
                        powerStatusclass = "";
                        if (device.powerStatus == "ON") {
                            powerStatusclass = "power-on";
                        }
                        else {
                            powerStatusclass = "power-off";
                        }
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Building Name</div><div class='field-value half-width'>"
                            + device.displayName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.lat + ',' + device.long + "</div></div><div class='field full-width'><div class='field-name half-width'>Energy Consumption</div><div class='field-value half-width'>"
                            + device.energyConsumption + "</div></div><div class='field full-width'><div class='field-name half-width'>Power Status</div><div class='field-value half-width'>"
                            + "<span class='" + powerStatusclass + "'></span></div></div><div class='field full-width'><div class='field-name half-width'>Energy Savings</div><div class='field-value half-width' "
                            + "id='gaugeContainer'></div></div><div class='field full-width'><div class='field-name half-width'>Power Source</div><div class='field-value half-width'>"
                            + device.powerSource + "</div></div><div class='field full-width'><div class='field-name half-width'>Building Temperature</div><div class='field-value half-width'>"
                            + device.temperature + "</div></div>";
                    }
                    if (device._id.solution == "SmartWasteManagement") {
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Name</div><div class='field-value half-width'>"
                            + device.displayName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.lat + ',' + device.long + "</div></div><div class='field full-width'><div class='field-name half-width'>Fill up Status of dustbin</div><div class='field-value half-width'>Low</div></div>"
                            + "<div class='field full-width'><div class='field-name half-width'>Alerts</div><div class='field-value half-width'>No Alerts</div></div>";
                    }
                    if (device._id.solution == "SmartStreetSolution") {
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Name</div><div class='field-value half-width'>"
                            + device.displayName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.lat + ',' + device.long + "</div></div><div class='field full-width'><div class='field-name half-width'>Energy Consumption</div><div class='field-value half-width'>367kWh</div></div>"
                            + "<div class='field full-width'><div class='field-name half-width'>Power Status</div><div class='field-value half-width'>"
                            + "<span class='power-on'></span></div></div>";
                    }
                    if (device._id.solution == "SmartParking") {
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Name</div><div class='field-value half-width'>"
                            + device.displayName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.lat + ',' + device.long + "</div></div><div class='field full-width'><div class='field-name half-width'>Parking Occupency</div><div class='field-value half-width'>67%</div></div>"
                            + "<div class='field full-width'><div class='field-name half-width'>Alerts</div><div class='field-value half-width'>"
                            + "No Alerts</div></div>";
                    }
                    if (device._id.solution == "SmartTransportation") {
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Name</div><div class='field-value half-width'>"
                            + device.displayName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.lat + ',' + device.long + "</div></div><div class='field full-width'><div class='field-name half-width'>Vehicle Status</div><div class='field-value half-width'><span class='power-on'></span></div></div>"
                            + "<div class='field full-width'><div class='field-name half-width'>Speed</div><div class='field-value half-width'>"
                            + "73 km/h</div></div>";
                    }
                    if (device._id.solution == "EMS") {
                        console.log(device.displayName);
                        tmpContent += "<div class='overlay-header'>Details <span class='close-button pull-right' onclick='overlay.toggleDOM();'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Site Name</div><div class='field-value half-width'>"
                            + device._id.siteName + "</div></div><div class='field full-width'><div class='field-name half-width'>Type</div><div class='field-value half-width'>"
                            + device._id.deviceType + "</div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device._id.latitude + ',' + device._id.longitude + "</div></div><div class='field full-width'><div class='field-name half-width'>Status</div><div class='field-value half-width'><span class='power-on'></span></div></div>"
                            + "<div class='field full-width'><div class='field-name half-width'>Energy(kWh)</div><div class='field-value half-width'>"
                            + "512</div></div>";
                    }
                    if (device.solution == "EMS") {
                        /* console.log(device.displayName);
                          tmpContent+="<div class='overlay-header'>Details <span class='close-button pull-right' onclick='overlay.onRemove();'>X</span></div>";
                         tmpContent+="<div class='field full-width'><div class='field-name half-width'>Site Name</div><div class='field-value half-width'>"
                         +device.siteName+"</div></div><div class='field full-width'><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                         +device.latitude+','+device.longitude+"</div></div><div class='field full-width'><div class='field-name half-width'>Status</div><div class='field-value half-width'><span class='power-on'></span></div></div>"
                         +"<div class='field full-width'><div class='field-name half-width'>Energy(kWh)</div><div class='field-value half-width'>"
                         +"512</div></div>"*/
                        powerStatusclass = "";
                        if (device.lightStatus == "1") {
                            powerStatusclass = "power-on";
                        }
                        else {
                            powerStatusclass = "power-off";
                        }
                        tmpContent += "<div class='overlay-header' >Details <span class='close-button pull-right' id='closeOverlay'>X</span></div>";
                        tmpContent += "<div class='field full-width'><div class='field-name half-width'>Site Name</div><div class='field-value half-width'>"
                            + device.siteName + "</div></div><div class='field full-width'><div class='field-name half-width'>Device Name</div><div class='field-value half-width' id='thisDevice'>"
                            + device.deviceName + "<div class='device-icon'></div></div></div><div class='field full-width'><div class='field-name half-width'>Lat & Long</div><div class='field-value half-width'>"
                            + device.latitude + ',' + device.longitude + "</div></div><div class='field full-width'><div class='field-name half-width'>Light Status</div><div class='field-value half-width'>"
                            + "<span class='" + powerStatusclass + "'></span></div></div><div class='field full-width'><div class='field-name half-width'>Last Communication</div><div class='field-value half-width'>"
                            + device.ts + "</div></div>";
                    }
                    function drawGauge(id, value) {
                        var chart = c3.generate({
                            bindto: "#" + id,
                            data: {
                                columns: [
                                    ['data', value]
                                ],
                                type: 'gauge',
                                onclick: function (d, i) { console.log("onclick", d, i); },
                                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                            },
                            gauge: {
                                label: {
                                    format: function (value, ratio) {
                                        return value; //returning here the value and not the ratio
                                    },
                                    min: 0,
                                    max: 100,
                                    units: 'value'
                                }
                            },
                            color: {
                                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                                threshold: {
                                    unit: 'value',
                                    min: 0,
                                    max: 100,
                                    values: [0, 5, 10, 50]
                                }
                            },
                            size: {
                                height: 180
                            }
                        });
                    } //End of drawGauge function
                    var marker = new google.maps.Marker({
                        position: tempLatLng,
                        map: this_1.map,
                        icon: markerImage,
                        title: device.displayName
                    }); //End of marker
                    marker.content = tmpContent;
                    marker.gaugeValue = gaugeValue;
                    marker.drawGauge = drawGauge;
                    that.markers.push(marker);
                    if (this_1.type != "cityoverview") {
                        marker.addListener('click', function () {
                            that.zone.run(function () {
                                that.deviceName = device.deviceName;
                                that.siteName = device.siteName;
                                that.deviceId = device._id.deviceId;
                                // console.log('device',that.deviceName)
                            });
                            var element = document.getElementById("customOverlay");
                            if (element)
                                element.parentNode.removeChild(element);
                            overlay = new CustomOverlay(this.map, marker.content, marker.getPosition(), marker.gaugeValue, marker.drawGauge);
                            //***************GUauge creation******************////
                            //***********************************////
                        }); //End of Marker addListener 'click'
                        /*var infowindow = new google.maps.InfoWindow({
                         content: tmpContent
                       });
         
                       
                       marker.addListener('click', function() {
                         infowindow.open(map, marker);
                       });*/
                    } //End of if type != cityoverview
                    /* var closeButton = document.querySelector('.close-button');
       
                      marker.maps.event.addDomListener(closeButton, 'click', function(){
                         var element = document.getElementById("customOverlay");
                         if(element)
                         element.parentNode.removeChild(element);
                       });*/
                    /*marker.addListener('click', function() {
          infowindow.open(map, marker);
        });*/
                    /*marker.addListener('mouseout', function() {
                        infowindow.close();
                    });//end of mouseout listener*/
                };
                var this_1 = this, tmpContent, gaugeValue, powerStatusclass, powerStatusclass;
                /*let markers = tempList.map(function(device:any, i:any) {
                   return new google.maps.Marker({
                     position: {lat: Number(device.latitude), lng: Number(device.longitude)},
                     //label: labels[i % labels.length]
                   });
                 });
                console.log('markers',markers)
                 // Add a marker clusterer to manage the markers.
                 let markerCluster = new MarkerClusterer(map, markers,
                     {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});*/
                for (var _i = 0, tempList_1 = tempList; _i < tempList_1.length; _i++) {
                    var device = tempList_1[_i];
                    _loop_1(device);
                } //end of for
            } //End of If
        } // end of If "Objects"
        else if (changes["polygons"]) {
            var tempList = changes["polygons"].currentValue;
            if (tempList) {
                var _loop_2 = function (i) {
                    var data = i.geojson.features[0].geometry.coordinates[0];
                    triangleCoords = [];
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var latlong = data_1[_i];
                        triangleCoords.push({ lat: latlong[1], lng: latlong[0] });
                    }
                    /*data.forEach(function(latlong) {
                    triangleCoords.push({lat: latlong[1], lng: latlong[0]})
                      //console.log(latlong);
                    });*/
                    // Construct the polygon.
                    var bermudaTriangle = new google.maps.Polygon({
                        paths: triangleCoords,
                        strokeColor: i.color,
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        fillColor: i.color,
                        fillOpacity: 0.35
                    });
                    bermudaTriangle.setMap(this_2.map);
                    bermudaTriangle.set("Info", i.info); // Set some attributes for adding extra information into this polygon.   
                    google.maps.event.addListener(bermudaTriangle, 'click', function () {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent("Info : " + bermudaTriangle.get("Info"));
                        // 'laty,lngy' is the location of one point in PGpoints, which can be chosen as you wish
                        infoWindow.setPosition(new google.maps.LatLng(i.lat, i.long));
                        infoWindow.open(map);
                    });
                };
                var this_2 = this, triangleCoords;
                for (var _a = 0, tempList_2 = tempList; _a < tempList_2.length; _a++) {
                    var i = tempList_2[_a];
                    _loop_2(i);
                } //end of for loop
            } //end of if
        } // End of If Polygons
        //marker cluster
        /* let markerCluster = new MarkerClusterer(map, that.markers,
             {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});*/
    }; //ENd of ngOnchanges
    __decorate([
        core_1.Input('objects'),
        __metadata("design:type", Array)
    ], MapComponent.prototype, "objects", void 0);
    __decorate([
        core_1.Input('type'),
        __metadata("design:type", String)
    ], MapComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input('polygons'),
        __metadata("design:type", Array)
    ], MapComponent.prototype, "polygons", void 0);
    __decorate([
        core_1.Input('overallSiteDevices'),
        __metadata("design:type", Number)
    ], MapComponent.prototype, "overallSiteDevices", void 0);
    __decorate([
        core_1.Input('overallOfflineDevices'),
        __metadata("design:type", Number)
    ], MapComponent.prototype, "overallOfflineDevices", void 0);
    MapComponent = __decorate([
        core_1.Component({
            selector: 'map-component',
            templateUrl: './assets/src/app/map/map.component.html',
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService, core_1.NgZone, variables_service_1.VariablesService, router_1.Router])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map