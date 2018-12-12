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
var ajax_service_1 = require("./../shared/services/ajax.service");
var moment = require("moment");
var AlarmManagementComponent = /** @class */ (function () {
    function AlarmManagementComponent(ajaxService) {
        var _this = this;
        this.ajaxService = ajaxService;
        //public alarm_histories: any;
        this.alarm_histories = [];
        this.AlarmsDetails = [];
        this.f_sl = 1;
        this.f_nm = 1;
        this.isInchargeSelected = true;
        NProgress.start();
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "isAssigned": false }, "collection": "alarm_history" }).subscribe(function (alarm_history) {
            //this.alarm_histories = alarm_history
            for (var _i = 0, alarm_history_1 = alarm_history; _i < alarm_history_1.length; _i++) {
                var currentValue = alarm_history_1[_i];
                if (currentValue.clearedTime != "-") {
                    var clrearedDateTime = new Date(currentValue.clearedTime);
                    var clrearedCurrentData = moment(clrearedDateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.clearedTime = clrearedCurrentData;
                }
                if (currentValue.occuredTime != "-") {
                    var dateTime = new Date(currentValue.occuredTime);
                    var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.occuredTime = currentData;
                }
                _this.alarm_histories.push(currentValue);
            }
            _this.alarm_histories.reverse();
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "assignedAlarmDetails" }).subscribe(function (assignedAlarms) {
            for (var _i = 0, assignedAlarms_1 = assignedAlarms; _i < assignedAlarms_1.length; _i++) {
                var currentValue = assignedAlarms_1[_i];
                if (currentValue.clearedTime != "-") {
                    var clrearedDateTime = new Date(currentValue.clearedTime);
                    var clrearedCurrentData = moment(clrearedDateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.clearedTime = clrearedCurrentData;
                }
                if (currentValue.occuredTime != "-") {
                    var dateTime = new Date(currentValue.occuredTime);
                    var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.occuredTime = currentData;
                }
                _this.AlarmsDetails.push(currentValue);
            }
            _this.AlarmsDetails.reverse();
        });
        NProgress.done();
    }
    AlarmManagementComponent.prototype.ngOnInit = function () {
        var alarmOverviewOpen = 0, alarmOverviewClosed = 0, alarmOverviewAck = 0;
        var alarmSeverityCritical = 0, alarmSeverityMajor = 0, alarmSeverityMinor = 0, alarmSeverityWarning = 0;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "alarm_history" }).subscribe(function (alarm_history) {
            var alarmSeverity;
            for (var _i = 0, alarm_history_2 = alarm_history; _i < alarm_history_2.length; _i++) {
                var currentValue = alarm_history_2[_i];
                if (currentValue.status == 'Open') {
                    alarmOverviewOpen++;
                }
                else if (currentValue.status == 'Close') {
                    alarmOverviewClosed++;
                }
                else { //Acknowledge
                    alarmOverviewAck++;
                }
                if (currentValue.severity == 'Critical') {
                    alarmSeverityCritical++;
                }
                else if (currentValue.severity == 'Major') {
                    alarmSeverityMajor++;
                }
                else if (currentValue.severity == 'Minor') {
                    alarmSeverityMinor++;
                }
                else {
                    alarmSeverityWarning++;
                }
            }
            console.log(alarmOverviewOpen);
            var chart1 = c3.generate({
                bindto: '#chart1',
                data: {
                    columns: [
                        ['Open', alarmOverviewOpen],
                        ['Closed', alarmOverviewClosed],
                        ['Acknowledge', alarmOverviewAck]
                    ],
                    type: 'pie',
                    colors: {
                        'Open': '#CC2127',
                        'Closed': '#5CC44C',
                        'Acknowledge': '#5C407B'
                    }
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return value;
                        }
                    }
                }
            });
            var chart2 = c3.generate({
                bindto: '#chart2',
                data: {
                    columns: [
                        ['Critical', alarmSeverityCritical],
                        ['Major', alarmSeverityMajor],
                        ['Minor ', alarmSeverityMinor],
                        ['Warning', alarmSeverityWarning]
                    ],
                    type: 'pie',
                    colors: {
                        'Critical': '#CC2127',
                        'Major': 'orange',
                        'Warning': '#FFCC66',
                        'Minor': 'blue'
                    }
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return value;
                        }
                    }
                }
            });
        });
    };
    AlarmManagementComponent.prototype.showIncharge = function (alarmHistory) {
        var _this = this;
        this.alarmHistory = alarmHistory;
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "incharge_details" }).subscribe(function (incharge_details) {
            _this.inchargeDetails = incharge_details;
        });
        this.isInchargeSelected = true;
        $('#myModal').modal('show');
    };
    AlarmManagementComponent.prototype.getInchargeDetails = function (inchargeDetails) {
        this.selectedInchargeDetails = inchargeDetails;
        this.isInchargeSelected = false;
    };
    AlarmManagementComponent.prototype.saveAssignedAlarms = function (inchargeGroup) {
        var _this = this;
        var merged = {};
        var _id = {
            "_id": this.alarmHistory._id,
            "isAssigned": true,
            "alarmId": this.alarmHistory.alarmId,
            "alarmName": this.alarmHistory.alarmName,
            "severity": this.alarmHistory.severity,
            "description": this.alarmHistory.description,
            "occuredTime": this.alarmHistory.occuredTime,
            "clearedTime": this.alarmHistory.clearedTime,
            "status": this.alarmHistory.status,
            "siteName": this.alarmHistory.siteName,
            "deviceName": this.alarmHistory.deviceName,
        };
        var assignedAlarmDetails = {
            "alarmId": this.alarmHistory.alarmId,
            "alarmName": this.alarmHistory.alarmName,
            "severity": this.alarmHistory.severity,
            "occuredTime": this.alarmHistory.occuredTime,
            "clearedTime": this.alarmHistory.clearedTime,
            "description": this.alarmHistory.description,
            "status": this.alarmHistory.status,
            "siteName": this.alarmHistory.siteName,
            "deviceName": this.alarmHistory.deviceName,
            "inchargePersonName": this.selectedInchargeDetails.name,
            "inchargePersonPhNo": this.selectedInchargeDetails.phNumber,
            "inchargePersonMail": this.selectedInchargeDetails.mail
        };
        this.ajaxService.saveObject(assignedAlarmDetails, "assignedAlarmDetails").subscribe(function (assignedAlarmDetails) {
            _this.popupStatusMessage = 'Assigned Alarm ' + assignedAlarmDetails.message;
            console.log("_details", assignedAlarmDetails.message);
            document.getElementById("openAlarmModalButton").click();
        });
        this.ajaxService.saveObject(_id, "alarm_history").subscribe(function (alarm_history) {
            //this.popupStatusMessage = 'Site '+alarm_history.message;
            console.log("_details", alarm_history.message);
            //document.getElementById("openModalButton").click();
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "assignedAlarmDetails" }).subscribe(function (assignedAlarms) {
            _this.AlarmsDetails = [];
            for (var _i = 0, assignedAlarms_2 = assignedAlarms; _i < assignedAlarms_2.length; _i++) {
                var currentValue = assignedAlarms_2[_i];
                var dateTime = new Date(currentValue.occuredTime);
                var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                currentValue.occuredTime = currentData;
                console.log("Cleared ", currentValue.clearedTime);
                if (currentValue.clearedTime != "-") {
                    var clrearedDateTime = new Date(currentValue.clearedTime);
                    var clrearedCurrentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                    currentValue.clearedTime = clrearedCurrentData;
                }
                _this.AlarmsDetails.push(currentValue);
                _this.AlarmsDetails.reverse();
            }
        });
        this.ajaxService.fetchSelectedObjects('getObjects', { "query": { "isAssigned": false }, "collection": "alarm_history" }).subscribe(function (alarm_history) {
            _this.alarm_histories = [];
            for (var _i = 0, alarm_history_3 = alarm_history; _i < alarm_history_3.length; _i++) {
                var currentValue = alarm_history_3[_i];
                var dateTime = new Date(currentValue.occuredTime);
                var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
                currentValue.occuredTime = currentData;
                _this.alarm_histories.push(currentValue);
            }
            _this.alarm_histories.reverse();
        });
        this.isInchargeSelected = true;
    };
    AlarmManagementComponent.prototype.getSelectedColumn = function (selectedColumn) {
        this.selectedColumn = selectedColumn - 1;
    };
    AlarmManagementComponent.prototype.sortingAlarmHistory = function (sortingOrder, property) {
        this.isAlarmHistoryAscending = !this.isAlarmHistoryAscending;
        var direction = (sortingOrder == 'ascending') ? 1 : -1;
        this.alarm_histories.sort(function (a, b) {
            if (sortingOrder == 'descending') {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else {
                    return 0;
                }
            }
            if (sortingOrder == 'ascending') {
                if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            }
        });
    };
    AlarmManagementComponent.prototype.sortingAssignedAlarm = function (sortingOrder, property) {
        this.isAlarmHistoryAscending = !this.isAlarmHistoryAscending;
        var direction = (sortingOrder == 'ascending') ? 1 : -1;
        this.AlarmsDetails.sort(function (a, b) {
            if (sortingOrder == 'descending') {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else {
                    return 0;
                }
            }
            if (sortingOrder == 'ascending') {
                if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            }
        });
    };
    //search..
    AlarmManagementComponent.prototype.getSiteName = function (event, selectedTable) {
        var filter = event.target.value.toUpperCase();
        var selectedbody = selectedTable + " tbody";
        var rows = document.querySelector(selectedbody).rows;
        for (var i = 0; i < rows.length; i++) {
            var firstCol = rows[i].cells[0].textContent.toUpperCase();
            var secondCol = rows[i].cells[1].textContent.toUpperCase();
            var thirdCol = rows[i].cells[2].textContent.toUpperCase();
            var fourthCol = rows[i].cells[3].textContent.toUpperCase();
            var fifthCol = rows[i].cells[4].textContent.toUpperCase();
            var ninththCol = rows[i].cells[8].textContent.toUpperCase();
            if (this.selectedColumn == 0) {
                if (firstCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 1) {
                if (secondCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 2) {
                if (thirdCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 3) {
                if (fourthCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 4) {
                if (fifthCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
            if (this.selectedColumn == 8) {
                if (ninththCol.indexOf(filter) > -1) {
                    rows[i].style.display = "";
                }
                else {
                    rows[i].style.display = "none";
                }
            }
        }
    };
    AlarmManagementComponent.prototype.addIncharge = function () {
        $('#addIncharge').modal('show');
    };
    /*closeDropdown(){
        let dropDownn = document.getElementsByClassName('dropdown-menu')
        console.log(dropDownn);
        $(dropDownn).hide();
    }*/
    AlarmManagementComponent.prototype.addInchargeDetails = function () {
        var _this = this;
        var inchargeDetail = {
            'id': this.inchargeId,
            'name': this.inchargeName,
            'phNumber': this.inchargePhone,
            'mail': this.inchargeEmail
        };
        console.log('inchargeDetail', inchargeDetail);
        this.ajaxService.saveObject(inchargeDetail, "incharge_details").subscribe(function (incharge_details) {
            _this.ajaxService.fetchSelectedObjects('getObjects', { "query": {}, "collection": "incharge_details" }).subscribe(function (incharge_details) {
                _this.inchargeDetails = incharge_details;
                $('#myModal').modal('show');
            });
        });
        this.inchargeId = '';
        this.inchargeName = '';
        this.inchargePhone = '';
        this.inchargeEmail = '';
    };
    AlarmManagementComponent = __decorate([
        core_1.Component({
            selector: 'alarm-management',
            templateUrl: './assets/src/app/alarm-management/alarm-management.html'
        }),
        __metadata("design:paramtypes", [ajax_service_1.AjaxService])
    ], AlarmManagementComponent);
    return AlarmManagementComponent;
}());
exports.AlarmManagementComponent = AlarmManagementComponent;
//# sourceMappingURL=alarm-management.component.js.map