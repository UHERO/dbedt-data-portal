webpackJsonp([2,5],{

/***/ 1040:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(428);


/***/ }),

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(755);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_mergeMap__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ApiService = (function () {
    function ApiService(http) {
        this.http = http;
        this.cachedCategoryMeasures = [];
        this.cachedMeasurementSeries = [];
        // this.baseUrl = 'http://localhost:8080/v1';
        this.baseUrl = 'http://api.uhero.hawaii.edu/v1';
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        this.headers.append('Authorization', 'Bearer -VI_yuv0UzZNy4av1SM5vQlkfPK_JKnpGfMzuJR7d0M=');
        this.requestOptionsArgs = { headers: this.headers };
    }
    //  Get data from API
    // Gets all available categories. Used for navigation & displaying sublists
    ApiService.prototype.fetchCategories = function () {
        var _this = this;
        if (this.cachedCategories) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.cachedCategories);
        }
        else {
            var categories$_1 = this.http.get(this.baseUrl + "/category", this.requestOptionsArgs)
                .map(mapCategories)
                .do(function (val) {
                _this.cachedCategories = val;
                categories$_1 = null;
            });
            return categories$_1;
        }
    };
    // Gets measurements belonging to each category
    ApiService.prototype.fetchCategoryMeasures = function (id) {
        var _this = this;
        if (this.cachedCategoryMeasures[id]) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.cachedCategoryMeasures[id]);
        }
        else {
            var categoryMeasures$_1 = this.http.get((this.baseUrl + "/category/measurements?id=") + id, this.requestOptionsArgs)
                .map(mapData)
                .do(function (val) {
                _this.cachedCategoryMeasures[id] = val;
                categoryMeasures$_1 = null;
            });
            return categoryMeasures$_1;
        }
    };
    ApiService.prototype.fetchMeasurementSeries = function (id) {
        var _this = this;
        if (this.cachedMeasurementSeries[id]) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.cachedMeasurementSeries[id]);
        }
        else {
            var measurementSeries$_1 = this.http.get((this.baseUrl + "/measurement/series?id=") + id + "&expand=true", this.requestOptionsArgs)
                .map(mapData)
                .do(function (val) {
                _this.cachedMeasurementSeries[id] = val;
                measurementSeries$_1 = null;
            });
            return measurementSeries$_1;
        }
    };
    ApiService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], ApiService);
    return ApiService;
    var _a;
}());
// Create a nested JSON of parent and child categories
// Used for landing-page.component
// And side bar navigation on single-series & table views
function mapCategories(response) {
    var categories = response.json().data;
    var dataMap = categories.reduce(function (map, value) { return (map[value.id] = value, map); }, {});
    var categoryTree = [];
    categories.forEach(function (value) {
        var parent = dataMap[value.parentId];
        if (parent) {
            (parent.children || (parent.children = [])).push(value);
        }
        else {
            categoryTree.push(value);
        }
    });
    var result = categoryTree;
    categoryTree.forEach(function (category) {
        if (category.id === 60) {
            result = category.children;
        }
    });
    return result;
}
function mapData(response) {
    var data = response.json().data;
    return data;
}
//# sourceMappingURL=api.service.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_service__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__ = __webpack_require__(353);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategorySidebarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var actionMapping = {
    mouse: {
        click: __WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__["b" /* TREE_ACTIONS */].TOGGLE_SELECTED_MULTI,
        expanderClick: __WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__["b" /* TREE_ACTIONS */].TOGGLE_SELECTED_MULTI
    }
};
var CategorySidebarComponent = (function () {
    function CategorySidebarComponent(_apiService) {
        this._apiService = _apiService;
        this.ids = [];
        // Emit ids of selected categories to app.component
        this.selectedCatIds = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    CategorySidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subCategories = this._apiService.fetchCategories().subscribe(function (categories) {
            categories.forEach(function (category) {
                category.children.forEach(function (child) {
                    child.hasChildren = true;
                });
            });
            _this.nodes = categories;
        });
        this.options = {
            getChildren: function (node) {
                var children = [];
                return _this._apiService.fetchCategoryMeasures(node.id).toPromise();
            },
            actionMapping: actionMapping
        };
    };
    CategorySidebarComponent.prototype.ngOnDestroy = function () {
        this.subCategories.unsubscribe();
    };
    CategorySidebarComponent.prototype.activateNode = function (e) {
        var _this = this;
        if (e.node.hasChildren) {
            e.node.expand();
        }
        if (!e.node.hasChildren) {
            var indicator = this.tree.treeModel.getNodeById(e.node.id);
            var subcategory = $(indicator.parent.elementRef.nativeElement);
            var category = $(indicator.parent.parent.elementRef.nativeElement);
            // create tracking for node position, used for table ordering
            var indices = [];
            var categoryId_1 = e.node.parent.parent.data.id;
            var subcategoryId_1 = e.node.parent.data.id;
            var indicatorId_1 = e.node.data.id;
            var tree = e.node.treeModel.nodes;
            var cat = tree.find(function (node) { return node.id === categoryId_1; });
            var subcat = cat.children.find(function (node) { return node.id === subcategoryId_1; });
            var ind = subcat.children.find(function (node) { return node.id === indicatorId_1; });
            indices.push(tree.indexOf(cat));
            indices.push(cat.children.indexOf(subcat));
            indices.push(subcat.children.indexOf(ind));
            var position = this.nodePosition(indices);
            // Bold the text of the subcategory and top level category when selecting an indicator
            this.addBold(subcategory, category);
            this.ids.push({ id: e.node.id, position: position });
            setTimeout(function () {
                _this.selectedCatIds.emit(_this.ids);
            }, 20);
        }
    };
    CategorySidebarComponent.prototype.nodePosition = function (indices) {
        var pad = '00';
        var result = '';
        indices.forEach(function (index) {
            var str = '' + index;
            var paddedStr = pad.substring(0, pad.length - str.length) + str;
            result += paddedStr;
        });
        return result;
    };
    CategorySidebarComponent.prototype.addBold = function (subcategory, category) {
        var ignoreClasses = '.toggle-children-wrapper, .toggle-children, .toggle-children-placeholder';
        subcategory.find('span').not(ignoreClasses).first().addClass('bold-selected');
        category.find('span').not(ignoreClasses).first().addClass('bold-selected');
    };
    CategorySidebarComponent.prototype.deactivateNode = function (e) {
        var _this = this;
        if (e.node.hasChildren) {
            e.node.collapse();
        }
        if (!e.node.hasChildren) {
            var indicator = this.tree.treeModel.getNodeById(e.node.id);
            var subcategory = indicator.parent;
            var activeIndicator = this.checkActiveIndicators(subcategory);
            var category = indicator.parent.level === 1 ? indicator.parent : indicator.parent.parent;
            if (!activeIndicator) {
                var span = $(category.elementRef.nativeElement).find('span').removeClass('bold-selected');
            }
            var deactivated = this.ids.find(function (id) { return id.id === e.node.id; });
            var idIndex = this.ids.indexOf(deactivated);
            if (idIndex > -1) {
                // Remove deactivated node from list of ids
                this.ids.splice(idIndex, 1);
                setTimeout(function () {
                    _this.selectedCatIds.emit(_this.ids);
                }, 20);
            }
        }
    };
    CategorySidebarComponent.prototype.checkActiveIndicators = function (subcategory) {
        var activeIndicator = false;
        if (subcategory.children) {
            subcategory.children.forEach(function (indicator) {
                if (indicator.isActive) {
                    activeIndicator = true;
                }
            });
        }
        return activeIndicator;
    };
    // Deactivate nodes when clicking on Clear All Selections
    CategorySidebarComponent.prototype.reset = function () {
        var active = this.tree.treeModel.activeNodes;
        if (active) {
            active.forEach(function (node) {
                node.setIsActive(false);
                node.blur();
            });
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', Object)
    ], CategorySidebarComponent.prototype, "selectedCatIds", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__["c" /* TreeComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__["c" /* TreeComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2_angular2_tree_component__["c" /* TreeComponent */]) === 'function' && _a) || Object)
    ], CategorySidebarComponent.prototype, "tree", void 0);
    CategorySidebarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-category-sidebar',
            template: __webpack_require__(747),
            styles: [__webpack_require__(730)],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* ViewEncapsulation */].None
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */]) === 'function' && _b) || Object])
    ], CategorySidebarComponent);
    return CategorySidebarComponent;
    var _a, _b;
}());
//# sourceMappingURL=category-sidebar.component.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelperService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HelperService = (function () {
    function HelperService() {
    }
    HelperService.prototype.categoryDateArray = function (selectedDates, selectedFreqs) {
        // Dates used in table header
        var dateArray = [];
        var m = { 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: '10', 11: '11', 12: '12' };
        var q = { 1: 'Q1', 4: 'Q2', 7: 'Q3', 10: 'Q4' };
        var startYear = +selectedDates.startDate.substr(0, 4);
        var endYear = +selectedDates.endDate.substr(0, 4);
        var startMonth = +selectedDates.startDate.substr(5, 2);
        var endMonth = +selectedDates.endDate.substr(5, 2);
        var annualSelected = selectedFreqs.indexOf('A') > -1;
        var monthSelected = selectedFreqs.indexOf('M') > -1;
        var quarterSelected = selectedFreqs.indexOf('Q') > -1;
        // Check if selectedDates' properties have values set (i.e. date range selectors have been used)
        var dates = this.checkSelectedDates(selectedDates, monthSelected, startYear, endYear, startMonth, endMonth, q);
        startYear = dates.startYear;
        endYear = dates.endYear;
        startMonth = dates.startMonth;
        endMonth = dates.endMonth;
        while (startYear + '-' + m[startMonth] + '-01' <= endYear + '-' + m[endMonth] + '-01') {
            // Frequency display order: M, Q, A
            if (monthSelected) {
                dateArray.push({ date: startYear.toString() + '-' + m[startMonth] + '-01', tableDate: startYear.toString() + '-' + m[startMonth] });
            }
            if (quarterSelected) {
                var qMonth = this.addQuarterObs(startMonth, monthSelected);
                if (qMonth) {
                    dateArray.push({ date: startYear.toString() + '-' + m[qMonth] + '-01', tableDate: startYear.toString() + ' ' + q[qMonth] });
                }
            }
            if (annualSelected) {
                var addAnnual = this.addAnnualObs(startMonth, monthSelected, quarterSelected);
                if (addAnnual) {
                    dateArray.push({ date: startYear.toString() + '-01-01', tableDate: startYear.toString() });
                }
            }
            startYear = startMonth === 12 ? startYear += 1 : startYear;
            startMonth = startMonth === 12 ? 1 : startMonth += 1;
        }
        return dateArray;
    };
    HelperService.prototype.addQuarterObs = function (startMonth, monthSelected) {
        var monthCheck, qMonth;
        // If M not selected, add Q at months 1, 4, 7, 10 (i.e. startMonth === 1, 4, 7, 10)
        if (!monthSelected) {
            qMonth = startMonth;
            monthCheck = this.checkStartMonth(startMonth + 2);
            if (monthCheck) {
                return qMonth;
            }
            ;
        }
        // If M is selected, add Q after months 3, 7, 9, 12 (i.e. startMonth === 3, 7, 9, 12)
        if (monthSelected) {
            qMonth = startMonth - 2;
            monthCheck = this.checkStartMonth(startMonth);
            if (monthCheck) {
                return qMonth;
            }
            ;
        }
    };
    HelperService.prototype.addAnnualObs = function (startMonth, monthSelected, quarterSelected) {
        // If M selected, add A after month 12
        if (monthSelected && startMonth === 12) {
            return true;
        }
        // If Q selected (w/o M), add A after 4th Quarter
        if (quarterSelected && !monthSelected && startMonth === 10) {
            return true;
        }
        // If only A selected, add to date array
        if (!quarterSelected && !monthSelected && startMonth === 1) {
            return true;
        }
        return false;
    };
    HelperService.prototype.checkSelectedDates = function (selectedDates, monthSelected, startYear, endYear, startMonth, endMonth, quarters) {
        startYear = selectedDates.selectedStartYear ? +selectedDates.selectedStartYear : startYear;
        endYear = selectedDates.selectedEndYear ? +selectedDates.selectedEndYear : endYear;
        startMonth = selectedDates.selectedStartMonth ? +selectedDates.selectedStartMonth : startMonth;
        endMonth = selectedDates.selectedEndMonth ? +selectedDates.selectedEndMonth : endMonth;
        if (!monthSelected) {
            startMonth = selectedDates.selectedStartQuarter ? this.setStartMonthQ(quarters, selectedDates, startMonth) : startMonth;
            endMonth = selectedDates.selectedEndQuarter ? this.setEndMonthQ(quarters, selectedDates, endMonth) : endMonth;
        }
        return { startYear: startYear, endYear: endYear, startMonth: startMonth, endMonth: endMonth };
    };
    // If returns true, add quarter to date array
    HelperService.prototype.checkStartMonth = function (month) {
        if (month === 3 || month === 6 || month === 9 || month === 12) {
            return true;
        }
        return false;
    };
    // Get start month based on selected start quarter
    HelperService.prototype.setStartMonthQ = function (quarters, selectedDates, startMonth) {
        for (var key in quarters) {
            if (quarters[key] === selectedDates.selectedStartQuarter) {
                startMonth = +key;
            }
        }
        return startMonth;
    };
    // Get end month based on selected end quarter
    HelperService.prototype.setEndMonthQ = function (quarters, selectedDates, endMonth) {
        for (var key in quarters) {
            if (quarters[key] === selectedDates.selectedEndQuarter) {
                endMonth = +key + 2;
            }
        }
        return endMonth;
    };
    // Create list of years for year range selectors
    HelperService.prototype.yearsRange = function (selectedDates) {
        var allYears = [];
        var startYear = +selectedDates.startDate.substr(0, 4);
        var endYear = +selectedDates.endDate.substr(0, 4);
        while (startYear <= endYear) {
            allYears.push(startYear.toString());
            startYear += 1;
        }
        allYears = allYears.reverse();
        var minYear = allYears[allYears.length - 1];
        var maxYear = allYears[0];
        var selectedStartIndex = allYears.indexOf(selectedDates.selectedStartYear);
        var selectedEndIndex = allYears.indexOf(selectedDates.selectedEndYear);
        selectedDates.selectedStartYear = selectedStartIndex > -1 ? selectedDates.selectedStartYear : minYear;
        selectedDates.selectedEndYear = selectedEndIndex > -1 ? selectedDates.selectedEndYear : maxYear;
        selectedDates.fromYearList = allYears;
        selectedDates.toYearList = allYears;
    };
    // Create list of quarters for quarter range selectors
    HelperService.prototype.quartersRange = function (selectedDates) {
        var allQuarters = ['Q4', 'Q3', 'Q2', 'Q1'];
        selectedDates.fromQuarterList = allQuarters;
        selectedDates.toQuarterList = allQuarters;
        this.minMaxYearQuarters(selectedDates);
        var minQuarter = selectedDates.fromQuarterList[selectedDates.fromQuarterList.length - 1];
        var maxQuarter = selectedDates.toQuarterList[0];
        var selectedStartIndex = selectedDates.fromQuarterList.indexOf(selectedDates.selectedStartQuarter);
        var selectedEndIndex = selectedDates.toQuarterList.indexOf(selectedDates.selectedEndQuarter);
        selectedDates.selectedStartQuarter = selectedStartIndex > -1 ? selectedDates.selectedStartQuarter : minQuarter;
        selectedDates.selectedEndQuarter = selectedEndIndex > -1 ? selectedDates.selectedEndQuarter : maxQuarter;
    };
    // Create list of months for month range selectors
    HelperService.prototype.monthsRange = function (selectedDates) {
        var allMonths = ['12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02', '01'];
        selectedDates.fromMonthList = allMonths;
        selectedDates.toMonthList = allMonths;
        this.minMaxYearMonths(selectedDates, allMonths);
        var minMonth = selectedDates.fromMonthList[selectedDates.fromMonthList.length - 1];
        var maxMonth = selectedDates.toMonthList[0];
        var selectedStartIndex = selectedDates.fromMonthList.indexOf(selectedDates.selectedStartMonth);
        var selectedEndIndex = selectedDates.toMonthList.indexOf(selectedDates.selectedEndMonth);
        selectedDates.selectedStartMonth = selectedStartIndex > -1 ? selectedDates.selectedStartMonth : minMonth;
        selectedDates.selectedEndMonth = selectedEndIndex > -1 ? selectedDates.selectedEndMonth : maxMonth;
    };
    HelperService.prototype.minMaxYearQuarters = function (selectedDates) {
        // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
        // If selectedStartYear is set to earliest/latest possible year, set quarter list based on earliest/latest month available
        var minYear = selectedDates.startDate.substr(0, 4);
        var maxYear = selectedDates.endDate.substr(0, 4);
        var startMonth = +selectedDates.startDate.substr(5, 2);
        var endMonth = +selectedDates.endDate.substr(5, 2);
        if (selectedDates.selectedStartYear === minYear) {
            selectedDates.fromQuarterList = this.minYearQuarters(startMonth);
        }
        if (selectedDates.selectedStartYear === maxYear) {
            selectedDates.fromQuarterList = this.maxYearQuarters(endMonth);
        }
        if (selectedDates.selectedEndYear === maxYear) {
            selectedDates.toQuarterList = this.maxYearQuarters(endMonth);
        }
        if (selectedDates.selectedEndYear === minYear) {
            selectedDates.toQuarterList = this.minYearQuarters(startMonth);
        }
    };
    HelperService.prototype.minMaxYearMonths = function (selectedDates, allMonths) {
        // If selectedStartYear is set to earliest/latest possible year, set month list based on earliest/latest month available
        // If selectedEndYear is set to earliest/latest possible year, set month list based on earliest/latest month available
        var minYear = selectedDates.startDate.substr(0, 4);
        var maxYear = selectedDates.endDate.substr(0, 4);
        var startMonth = selectedDates.startDate.substr(5, 2);
        var endMonth = selectedDates.endDate.substr(5, 2);
        if (selectedDates.selectedStartYear === minYear) {
            selectedDates.fromMonthList = allMonths.slice(0, allMonths.indexOf(startMonth) + 1);
        }
        if (selectedDates.selectedStartYear === maxYear) {
            selectedDates.fromMonthList = allMonths.slice(allMonths.indexOf(endMonth), allMonths.length);
        }
        if (selectedDates.selectedEndYear === maxYear) {
            selectedDates.toMonthList = allMonths.slice(allMonths.indexOf(endMonth), allMonths.length);
        }
        if (selectedDates.selectedEndYear === minYear) {
            selectedDates.toMonthList = allMonths.slice(0, allMonths.indexOf(startMonth) + 1);
        }
    };
    HelperService.prototype.minYearQuarters = function (month) {
        var q = ['Q4', 'Q3', 'Q2', 'Q1'];
        if (4 <= month && month < 7) {
            return q.slice(0, 3);
        }
        if (7 <= month && month < 10) {
            return q.slice(0, 2);
        }
        if (10 <= month) {
            return q.slice(0, 1);
        }
        return q;
    };
    HelperService.prototype.maxYearQuarters = function (month) {
        var q = ['Q4', 'Q3', 'Q2', 'Q1'];
        if (1 <= month && month < 4) {
            return q.slice(3);
        }
        if (4 <= month && month < 7) {
            return q.slice(2);
        }
        if (7 <= month && month < 10) {
            return q.slice(1);
        }
        return q;
    };
    HelperService.prototype.formatLevelData = function (seriesObservations, frequency, decimals, results, dates) {
        var _this = this;
        var obs = seriesObservations;
        var level = obs.transformationResults[0].observations;
        if (level) {
            level.forEach(function (entry) {
                if (frequency === 'A') {
                    var tableDate = entry.date.substr(0, 4);
                    results[tableDate] = _this.formatNum(+entry.value, decimals);
                }
                if (frequency === 'Q') {
                    var q = { '01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4' };
                    var tableDate = entry.date.substr(0, 4) + ' ' + q[entry.date.substr(5, 2)];
                    results[tableDate] = _this.formatNum(+entry.value, decimals);
                }
                if (frequency === 'M') {
                    var tableDate = entry.date.substr(0, 7);
                    results[tableDate] = _this.formatNum(+entry.value, decimals);
                }
            });
        }
        return results;
    };
    HelperService.prototype.formatNum = function (num, decimal) {
        var fixedNum;
        fixedNum = num.toFixed(decimal);
        // remove decimals
        var int = fixedNum | 0;
        var signCheck = num < 0 ? 1 : 0;
        // store deicmal value
        var remainder = Math.abs(fixedNum - int);
        var decimalString = ('' + remainder.toFixed(decimal)).substr(2, decimal);
        var intString = '' + int;
        var i = intString.length;
        var r = '';
        while ((i -= 3) > signCheck) {
            r = ',' + intString.substr(i, 3) + r;
        }
        var returnValue = intString.substr(0, i + 3) + r + (decimalString ? '.' + decimalString : '');
        // If int == 0, converting int to string drops minus sign
        if (int === 0 && num < 0) {
            return '-' + returnValue;
        }
        return returnValue;
    };
    HelperService.prototype.formatGeos = function (geo) {
        return { id: geo.handle, text: geo.name ? geo.name : geo.handle, freqs: geo.freqs, state: false };
    };
    HelperService.prototype.formatFreqs = function (freq) {
        return { id: freq.freq, text: freq.label, geos: freq.geos, state: false };
    };
    // Get a unique array of available regions for a category
    HelperService.prototype.uniqueGeos = function (geo, geoList) {
        var exist = false;
        for (var i in geoList) {
            // Multiselect Dropdown Component (geo & freq selectors) requires name and id properties
            if (geo.id === geoList[i].id) {
                exist = true;
                // If region already exists, check it's list of frequencies
                // Get a unique list of frequencies available for a region
                var freqs = geo.freqs;
                for (var j in freqs) {
                    if (!this.freqExist(geoList[i].freqs, freqs[j].freq)) {
                        geoList[i].freqs.push(freqs[j]);
                    }
                }
            }
        }
        if (!exist) {
            geoList.push(geo);
        }
    };
    HelperService.prototype.freqExist = function (freqArray, freq) {
        for (var n in freqArray) {
            if (freq === freqArray[n].freq) {
                return true;
            }
        }
        return false;
    };
    // Get a unique array of available frequencies for a category
    HelperService.prototype.uniqueFreqs = function (freq, freqList) {
        var exist = false;
        for (var i in freqList) {
            if (freq.text === freqList[i].text) {
                exist = true;
                // If frequency already exists, check it's list of regions
                // Get a unique list of regions available for a frequency
                var geos = freq.geos;
                for (var j in geos) {
                    if (!this.geoExist(freqList[i].geos, geos[j].handle)) {
                        freqList[i].geos.push(geos[j]);
                    }
                }
            }
        }
        if (!exist) {
            freqList.push(freq);
        }
    };
    HelperService.prototype.geoExist = function (geoArray, geo) {
        for (var n in geoArray) {
            if (geo === geoArray[n].handle) {
                return true;
            }
        }
        return false;
    };
    HelperService.prototype.freqSort = function (freqArray) {
        var freqOrder = ['A', 'Q', 'M'];
        freqArray.sort(function (a, b) {
            var aSort = freqOrder.indexOf(a.id);
            var bSort = freqOrder.indexOf(b.id);
            return (aSort < bSort) ? -1 : (aSort > bSort) ? 1 : 0;
        });
        return freqArray;
    };
    HelperService.prototype.areaSort = function (geoArray) {
        var areaOrder = ['HI', 'HAW', 'HON', 'KAU', 'MAU'];
        geoArray.sort(function (a, b) {
            var aSort = areaOrder.indexOf(a.id);
            var bSort = areaOrder.indexOf(b.id);
            return (aSort < bSort) ? -1 : (aSort > bSort) ? 1 : 0;
        });
        return geoArray;
    };
    HelperService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [])
    ], HelperService);
    return HelperService;
}());
//# sourceMappingURL=helper.service.js.map

/***/ }),

/***/ 427:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 427;


/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(527);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(548);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 547:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_service__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helper_service__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__category_sidebar_category_sidebar_component__ = __webpack_require__(351);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(_apiService, _helper) {
        this._apiService = _apiService;
        this._helper = _helper;
        // List of indicators selected from category-tree
        this.selectedIndicators = [];
        this.indicatorSelected = false;
        // List of selected regions and frequencies
        this.selectedGeos = [];
        this.selectedFreqs = [];
        this.annualSelected = false;
        this.quarterSelected = false;
        this.monthSelected = false;
        this.tableData = [];
        this.displayTable = false;
    }
    AppComponent.prototype.getSelectedIndicators = function (selectedMeasurements) {
        var _this = this;
        var geoList = [];
        var freqList = [];
        this.selectedIndicators = [];
        selectedMeasurements.forEach(function (m) {
            _this._apiService.fetchMeasurementSeries(m.id).subscribe(function (series) {
                _this.initSettings(m.position, series, geoList, freqList);
            }, function (error) {
                _this.errorMsg = error;
            }, function () {
                _this.indicatorSelected = true;
                _this.freqSelectorList(freqList);
                _this.geoSelectorList(geoList);
                if (_this.selectedGeos.length && _this.selectedFreqs.length) {
                    _this.getSeries();
                }
            });
        });
        if (!this.selectedIndicators.length) {
            // Remove table if all categories are deselected and remove date selectors
            this.datesSelected = null;
            this.displayTable = false;
            this.regions = [];
            this.selectedGeos = [];
            this.frequencies = [];
            this.selectedFreqs = [];
            this.indicatorSelected = false;
            this.invalidDates = null;
            this.toggleDateSelectors();
        }
    };
    AppComponent.prototype.initSettings = function (position, series, geoList, freqList) {
        var _this = this;
        // Iterate through list of series to create list of areas and frequencies and identify observation dates
        var geoFreqs, freqGeos, obsStart, obsEnd;
        series.forEach(function (serie) {
            _this.selectedIndicators.push(serie);
            serie.position = position;
            geoFreqs = serie.geoFreqs;
            freqGeos = serie.freqGeos;
            obsStart = serie.seriesObservations.observationStart.substr(0, 10);
            obsEnd = serie.seriesObservations.observationEnd.substr(0, 10);
            geoFreqs.forEach(function (geo) {
                geo = _this._helper.formatGeos(geo);
                _this._helper.uniqueGeos(geo, geoList);
            });
            freqGeos.forEach(function (freq) {
                freq = _this._helper.formatFreqs(freq);
                _this._helper.uniqueFreqs(freq, freqList);
            });
        });
    };
    AppComponent.prototype.freqSelectorList = function (freqArray) {
        var _this = this;
        // Set list of frequencies for frequency selector
        if (this.frequencies) {
            freqArray.forEach(function (freq) {
                _this._helper.uniqueFreqs(freq, _this.frequencies);
            });
            this._helper.freqSort(this.frequencies);
        }
        else {
            this.frequencies = this._helper.freqSort(freqArray);
        }
    };
    AppComponent.prototype.geoSelectorList = function (geoArray) {
        var _this = this;
        // Set list of reginos for region selector
        if (this.regions) {
            geoArray.forEach(function (geo) {
                _this._helper.uniqueGeos(geo, _this.regions);
            });
            this._helper.areaSort(this.regions);
        }
        else {
            this.regions = this._helper.areaSort(geoArray);
        }
    };
    AppComponent.prototype.geoChange = function (e) {
        this.selectedGeos = e;
        if (!this.selectedGeos.length) {
            this.displayTable = false;
            this.toggleDateSelectors();
        }
        if (this.selectedIndicators.length && this.selectedFreqs.length) {
            this.getSeries();
            this.toggleDateSelectors();
        }
    };
    AppComponent.prototype.freqChange = function (e) {
        this.selectedFreqs = e;
        if (this.selectedIndicators.length && this.selectedGeos.length) {
            this.getSeries();
            this.toggleDateSelectors();
        }
        if (!this.selectedFreqs.length) {
            this.displayTable = false;
            this.annualSelected = false;
            this.quarterSelected = false;
            this.monthSelected = false;
        }
    };
    AppComponent.prototype.toggleDateSelectors = function () {
        var qIndex = this.selectedFreqs.indexOf('Q');
        var mIndex = this.selectedFreqs.indexOf('M');
        this.annualSelected = this.selectedFreqs.length > 0 && this.selectedIndicators.length > 0 && this.selectedGeos.length > 0;
        this.quarterSelected = qIndex > -1 && mIndex === -1;
        this.monthSelected = mIndex > -1;
    };
    AppComponent.prototype.getSeries = function () {
        var _this = this;
        var seriesData = [];
        this.selectedIndicators.forEach(function (indicatorSeries, indIndex) {
            var indicatorGeo = indicatorSeries.geography.handle;
            var indicatorFreq = indicatorSeries.frequencyShort;
            // Series level observations
            var indicatorLevel = indicatorSeries.seriesObservations.transformationResults[0].observations;
            _this.selectedGeos.forEach(function (geo) {
                _this.selectedFreqs.forEach(function (freq) {
                    if (indicatorGeo === geo && indicatorFreq === freq && indicatorLevel !== null) {
                        seriesData.push(indicatorSeries);
                    }
                });
            });
            if (indIndex === _this.selectedIndicators.length - 1) {
                _this.datesSelected = _this.datesSelected ? _this.datesSelected : {};
                _this.datesSelected.endDate = '';
                _this.datesSelected.startDate = '';
                if (seriesData.length !== 0) {
                    seriesData.forEach(function (series, seriesIndex) {
                        // Find the earliest and lastest observation dates, used to set dates in the range selectors
                        var obsStart = series.seriesObservations.observationStart.substr(0, 10);
                        var obsEnd = series.seriesObservations.observationEnd.substr(0, 10);
                        if (_this.datesSelected.startDate === '' || _this.datesSelected.startDate > obsStart) {
                            _this.datesSelected.startDate = obsStart;
                        }
                        if (_this.datesSelected.endDate === '' || _this.datesSelected.endDate < obsEnd) {
                            _this.datesSelected.endDate = obsEnd;
                        }
                        if (seriesIndex === seriesData.length - 1) {
                            _this.noSeries = null;
                            _this.getDates();
                            _this.formatTableData(seriesData);
                        }
                    });
                }
                else {
                    // Display warning, if no series exists for selected indicators, areas, and frequencies
                    _this.noSeries = 'Selection Not Available';
                }
            }
        });
    };
    AppComponent.prototype.showTable = function () {
        this.displayTable = true;
    };
    AppComponent.prototype.formatTableData = function (seriesData) {
        var _this = this;
        // Format data for datatables module (indicator-table component)
        this.tableData = [];
        seriesData.forEach(function (series) {
            var result = {};
            _this.dateArray.forEach(function (date) {
                result[date.tableDate] = ' ';
            });
            // If decimal value is not specified, round values to 2 decimal places
            var decimals = _this.setDecimals(series.decimals);
            var exist = _this.tableData.findIndex(function (data) { return data.indicator === series.title && data.region === series.geography.name; });
            // If exists, add observations corresponding to the series frequency
            if (exist !== -1) {
                if (series.frequencyShort === 'A') {
                    _this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, _this.tableData[exist].observations, _this.dateArray);
                }
                if (series.frequencyShort === 'Q') {
                    _this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, _this.tableData[exist].observations, _this.dateArray);
                }
                if (series.frequencyShort === 'M') {
                    _this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, _this.tableData[exist].observations, _this.dateArray);
                }
            }
            else {
                _this.tableData.push({
                    position: series.position,
                    indicator: series.title,
                    region: series.geography.name,
                    units: series.unitsLabelShort,
                    source: series.source_description ? series.source_description : ' ',
                    observations: _this._helper.formatLevelData(series.seriesObservations, series.frequencyShort, decimals, result, _this.dateArray)
                });
            }
        });
    };
    AppComponent.prototype.setDecimals = function (seriesDecimals) {
        if (seriesDecimals) {
            return seriesDecimals;
        }
        else if (seriesDecimals === 0) {
            return seriesDecimals;
        }
        else {
            return 2;
        }
    };
    AppComponent.prototype.checkSelections = function () {
        var disable = true;
        // Enable Get Data button if selections have been made in indicators, frequencies, and areas
        if (this.selectedIndicators.length && this.selectedFreqs.length && this.selectedGeos.length && !this.noSeries && !this.invalidDates) {
            disable = false;
        }
        return disable;
    };
    AppComponent.prototype.clearSelections = function () {
        this.displayTable = false;
        this.selectedIndicators = [];
        this.datesSelected = null;
        this.frequencies = [];
        this.regions = [];
        this.selectedFreqs = [];
        this.selectedGeos = [];
        this.dateArray = [];
        this.indicatorSelected = false;
        this.toggleDateSelectors();
        this.sidebar.reset();
    };
    AppComponent.prototype.startYearChange = function (e) {
        this.datesSelected.selectedStartYear = e;
        this.getDates();
    };
    AppComponent.prototype.startQuarterChange = function (e) {
        this.datesSelected.selectedStartQuarter = e;
        this.getDates();
    };
    AppComponent.prototype.startMonthChange = function (e) {
        this.datesSelected.selectedStartMonth = e;
        this.getDates();
    };
    AppComponent.prototype.endYearChange = function (e) {
        this.datesSelected.selectedEndYear = e;
        this.getDates();
    };
    AppComponent.prototype.endQuarterChange = function (e) {
        this.datesSelected.selectedEndQuarter = e;
        this.getDates();
    };
    AppComponent.prototype.endMonthChange = function (e) {
        this.datesSelected.selectedEndMonth = e;
        this.getDates();
    };
    AppComponent.prototype.getDates = function () {
        var validDates = this.checkValidDates(this.datesSelected);
        if (validDates) {
            this.invalidDates = null;
            this._helper.yearsRange(this.datesSelected);
            if (this.selectedFreqs.indexOf('Q') > -1) {
                this._helper.quartersRange(this.datesSelected);
            }
            if (this.selectedFreqs.indexOf('M') > -1) {
                this._helper.monthsRange(this.datesSelected);
            }
            this.dateArray = this._helper.categoryDateArray(this.datesSelected, this.selectedFreqs);
        }
        else {
            this.invalidDates = 'Invalid date selection';
            this.displayTable = false;
        }
    };
    AppComponent.prototype.checkValidDates = function (dates) {
        var valid = true;
        if (dates.selectedStartYear > dates.selectedEndYear) {
            valid = false;
        }
        if (dates.selectedStartYear === dates.selectedEndYear) {
            if (dates.selectedStartQuarter > dates.selectedEndQuarter) {
                valid = false;
            }
            if (dates.selectedStartMonth > dates.selectedEndMonth) {
                valid = false;
            }
        }
        return valid;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_3__category_sidebar_category_sidebar_component__["a" /* CategorySidebarComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__category_sidebar_category_sidebar_component__["a" /* CategorySidebarComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__category_sidebar_category_sidebar_component__["a" /* CategorySidebarComponent */]) === 'function' && _a) || Object)
    ], AppComponent.prototype, "sidebar", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(746),
            styles: [__webpack_require__(729)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__helper_service__["a" /* HelperService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__helper_service__["a" /* HelperService */]) === 'function' && _c) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 548:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(518);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(333);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_service__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helper_service__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(547);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__category_sidebar_category_sidebar_component__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angular2_tree_component__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__geo_selector_geo_selector_component__ = __webpack_require__(550);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__freq_selector_freq_selector_component__ = __webpack_require__(549);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__year_selector_year_selector_component__ = __webpack_require__(554);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__quarter_selector_quarter_selector_component__ = __webpack_require__(553);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__month_selector_month_selector_component__ = __webpack_require__(552);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__indicator_table_indicator_table_component__ = __webpack_require__(551);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__category_sidebar_category_sidebar_component__["a" /* CategorySidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_9__geo_selector_geo_selector_component__["a" /* GeoSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_10__freq_selector_freq_selector_component__["a" /* FreqSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_10__freq_selector_freq_selector_component__["a" /* FreqSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_11__year_selector_year_selector_component__["a" /* YearSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_12__quarter_selector_quarter_selector_component__["a" /* QuarterSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_13__month_selector_month_selector_component__["a" /* MonthSelectorComponent */],
                __WEBPACK_IMPORTED_MODULE_14__indicator_table_indicator_table_component__["a" /* IndicatorTableComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_8_angular2_tree_component__["a" /* TreeModule */],
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_4__api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_5__helper_service__["a" /* HelperService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 549:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FreqSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FreqSelectorComponent = (function () {
    function FreqSelectorComponent() {
        this.selectedFreqList = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    FreqSelectorComponent.prototype.ngOnInit = function () {
    };
    FreqSelectorComponent.prototype.toggle = function (freq, event) {
        var _this = this;
        var index = this.selectedFreqs.indexOf(freq);
        if (index === -1) {
            this.selectedFreqs.push(freq);
        }
        else {
            this.selectedFreqs.splice(index, 1);
        }
        setTimeout(function () {
            _this.selectedFreqList.emit(_this.selectedFreqs);
        }, 20);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], FreqSelectorComponent.prototype, "indicator", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], FreqSelectorComponent.prototype, "freqs", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], FreqSelectorComponent.prototype, "selectedFreqs", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], FreqSelectorComponent.prototype, "selectedFreqList", void 0);
    FreqSelectorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-freq-selector',
            template: __webpack_require__(748),
            styles: [__webpack_require__(731)],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* ViewEncapsulation */].None
        }), 
        __metadata('design:paramtypes', [])
    ], FreqSelectorComponent);
    return FreqSelectorComponent;
    var _a;
}());
//# sourceMappingURL=freq-selector.component.js.map

/***/ }),

/***/ 550:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeoSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var GeoSelectorComponent = (function () {
    function GeoSelectorComponent() {
        this.selectedGeoList = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    GeoSelectorComponent.prototype.ngOnInit = function () {
    };
    GeoSelectorComponent.prototype.toggle = function (geo, event) {
        var _this = this;
        var index = this.selectedGeos.indexOf(geo);
        if (index === -1) {
            this.selectedGeos.push(geo);
        }
        else {
            this.selectedGeos.splice(index, 1);
        }
        setTimeout(function () {
            _this.selectedGeoList.emit(_this.selectedGeos);
        }, 20);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], GeoSelectorComponent.prototype, "indicator", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], GeoSelectorComponent.prototype, "regions", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], GeoSelectorComponent.prototype, "selectedGeos", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', Object)
    ], GeoSelectorComponent.prototype, "selectedGeoList", void 0);
    GeoSelectorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-geo-selector',
            template: __webpack_require__(749),
            styles: [__webpack_require__(732)],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* ViewEncapsulation */].None
        }), 
        __metadata('design:paramtypes', [])
    ], GeoSelectorComponent);
    return GeoSelectorComponent;
}());
//# sourceMappingURL=geo-selector.component.js.map

/***/ }),

/***/ 551:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_service__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_datatables_net__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_datatables_net___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_datatables_net__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_datatables_net_fixedcolumns__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_datatables_net_fixedcolumns___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_datatables_net_fixedcolumns__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_datatables_net_buttons_js_dataTables_buttons_js__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_datatables_net_buttons_js_dataTables_buttons_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_datatables_net_buttons_js_dataTables_buttons_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_datatables_net_buttons_js_buttons_html5_js__ = __webpack_require__(726);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_datatables_net_buttons_js_buttons_html5_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_datatables_net_buttons_js_buttons_html5_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_datatables_net_buttons_js_buttons_flash_js__ = __webpack_require__(725);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_datatables_net_buttons_js_buttons_flash_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_datatables_net_buttons_js_buttons_flash_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_datatables_net_buttons_js_buttons_print_js__ = __webpack_require__(727);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_datatables_net_buttons_js_buttons_print_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_datatables_net_buttons_js_buttons_print_js__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndicatorTableComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var IndicatorTableComponent = (function () {
    function IndicatorTableComponent(_api) {
        this._api = _api;
    }
    IndicatorTableComponent.prototype.ngOnInit = function () {
    };
    IndicatorTableComponent.prototype.ngOnChanges = function (inputChanges) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2_jquery__('span.loading').css('display', 'inline-block');
        setTimeout(function () {
            _this.initDatatable();
        }, 20);
    };
    IndicatorTableComponent.prototype.initDatatable = function () {
        var tableColumns = [];
        var indicatorTable = __WEBPACK_IMPORTED_MODULE_2_jquery__('#indicator-table');
        if (this.tableWidget) {
            // Destroy table if table has already been initialized
            this.tableWidget.destroy();
            indicatorTable.empty();
        }
        tableColumns.push({ title: 'Id', data: 'position' }, { title: 'Indicator', data: 'indicator' }, { title: 'Area', data: 'region' }, { title: 'Units', data: 'units' });
        this.dateArray.forEach(function (date) {
            tableColumns.push({ title: date.tableDate, data: 'observations.' + date.tableDate });
        });
        tableColumns.push({ title: 'Source', data: 'source' });
        var tableData = this.tableData;
        this.tableWidget = indicatorTable.DataTable({
            data: this.tableData,
            dom: 'Bt',
            buttons: [
                {
                    extend: 'excel',
                    text: '<i class="fa fa-file-excel-o" aria-hidden="true" title="Excel"></i>',
                    exportOptions: {
                        columns: ':visible'
                    },
                    customizeData: function (xlsx) {
                        var cols = xlsx.header.length;
                        var dbedtFooter = [];
                        var uheroFooter = [];
                        var addRow = [];
                        // Rows with different lengths break export
                        for (var i = 0; i < cols; i++) {
                            dbedtFooter.push('');
                            uheroFooter.push('');
                            addRow.push('');
                        }
                        dbedtFooter.unshift('Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/economic');
                        // Add an empty row before DBEDT and UHERO credit
                        xlsx.body.push(addRow);
                        xlsx.body.push(dbedtFooter);
                    },
                    customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                        var col = __WEBPACK_IMPORTED_MODULE_2_jquery__('col', sheet);
                        var textCells = __WEBPACK_IMPORTED_MODULE_2_jquery__('sheetData c is', sheet);
                        var rows = __WEBPACK_IMPORTED_MODULE_2_jquery__('sheetData row', sheet);
                        var dates = __WEBPACK_IMPORTED_MODULE_2_jquery__('v', rows[0]);
                        // Right align dates in first row
                        dates.each(function () {
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(this.parentElement).attr('s', 52);
                        });
                        // Right align cells with text, except footer
                        var i = 0;
                        while (i < textCells.length - 1) {
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(textCells[i].parentElement).attr('s', 52);
                            i++;
                        }
                    }
                },
                {
                    extend: 'csv',
                    text: '<i class="fa fa-file-text-o" aria-hidden="true" title="CSV"></i>',
                    exportOptions: {
                        columns: ':visible'
                    },
                    customize: function (csv) {
                        return csv + '\n\n Compiled by Research & Economic Analysis Division State of Hawaii Department of Business Economic Development and Tourism. For more information please visit: http://dbedt.hawaii.gov/economic';
                    }
                },
                {
                    extend: 'pdf',
                    text: '<i class="fa fa-file-pdf-o" aria-hidden="true" title="PDF"></i>',
                    orientation: 'landscape',
                    pageSize: 'letter',
                    message: 'Research & Economic Analysis Division, DBEDT',
                    exportOptions: {
                        columns: ':visible'
                    },
                    customize: function (doc) {
                        // Table rows should be divisible by 10
                        // Maintain consistant table width (i.e. add empty strings if row has less than 10 data cells)
                        function rowRightPad(row) {
                            var paddedRow = [];
                            row.forEach(function (item) {
                                paddedRow.push(item);
                            });
                            var rowDiff = paddedRow.length % 10;
                            var addString = 10 - rowDiff;
                            while (addString) {
                                paddedRow.push({ text: ' ', style: '' });
                                addString -= 1;
                            }
                            return paddedRow;
                        }
                        function splitTable(array, size) {
                            var result = [];
                            for (var i = 0; i < array.length; i += size) {
                                result.push(array.slice(i, i + size));
                            }
                            return result;
                        }
                        function rightAlign(array) {
                            array.forEach(function (cell) {
                                cell.alignment = 'right';
                            });
                        }
                        function noWrap(array) {
                            array.forEach(function (cell) {
                                cell.noWrap = true;
                            });
                        }
                        // Get original table object
                        var currentTable = doc.content[2].table.body;
                        var sources = [];
                        var formattedTable = [];
                        currentTable.forEach(function (row, index) {
                            var counter = currentTable.length;
                            // Fixed Columns: Indicator, Area, Units
                            var indicator = row[0];
                            var area = row[1];
                            var units = row[2];
                            // Store source info to append to end of export (include Indicator and Source)
                            var source = row[row.length - 1];
                            var sourceCopy = Object.assign({}, source);
                            var sourceRow = [indicator, sourceCopy];
                            sourceRow = rowRightPad(sourceRow);
                            sources.push(sourceRow);
                            // Get data from each original row excluding fixed columns and sources
                            var nonFixedCols = row.slice(3, row.length - 1);
                            // Split data into groups of arrays with max length == 7
                            var split = splitTable(nonFixedCols, 7);
                            for (var i = 0; i < split.length; i++) {
                                // Each group is used as a new row for the formatted tables
                                var newRow = split[i];
                                // Add the fixed columns to each new row
                                var indicatorCopy = Object.assign({}, indicator);
                                var areaCopy = Object.assign({}, area);
                                var unitsCopy = Object.assign({}, units);
                                newRow.unshift(indicatorCopy, areaCopy, unitsCopy);
                                if (newRow.length < 10) {
                                    newRow = rowRightPad(newRow);
                                }
                                // Right align cell text
                                rightAlign(newRow);
                                noWrap(newRow);
                                // Add new rows to formatted table
                                if (!formattedTable[index]) {
                                    formattedTable[index] = newRow;
                                }
                                else {
                                    formattedTable[index + counter] = newRow;
                                    counter += currentTable.length;
                                }
                            }
                        });
                        // Add sources
                        sources.forEach(function (source) {
                            // Right align cell text
                            rightAlign(source);
                            formattedTable.push(source);
                        });
                        doc.defaultStyle.fontSize = 10;
                        doc.styles.tableHeader.fontSize = 10;
                        doc.content[2].table.dontBreakRows = true;
                        doc.content[2].table.headerRows = 0;
                        doc.content[2].table.body = formattedTable;
                        doc.content.push({
                            text: 'Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/economic',
                        });
                    }
                },
                {
                    extend: 'print',
                    text: '<i class="fa fa-print" aria-hidden="true" title="Print"></i>',
                    message: 'Research & Economic Analysis Division, DBEDT',
                    exportOptions: {
                        columns: ':visible'
                    },
                    customize: function (win) {
                        function sortIndicators(a, b) {
                            if (a.position < b.position) {
                                return -1;
                            }
                            if (a.position > b.position) {
                                return 1;
                            }
                            return 0;
                        }
                        function sortObsDates(nonSorted, sorted) {
                            var result = [];
                            for (var i = 0; i < sorted.length; i++) {
                                var index = nonSorted.indexOf(sorted[i]);
                                result[i] = nonSorted[index];
                            }
                            return result;
                        }
                        function splitTable(array, size) {
                            var result = [];
                            for (var i = 0; i < array.length; i += size) {
                                result.push(array.slice(i, i + size));
                            }
                            return result;
                        }
                        // Get array of dates from table
                        var dates = tableColumns.slice(4, tableColumns.length - 1);
                        var dateArray = [];
                        dates.forEach(function (date) {
                            dateArray.push(date.title);
                        });
                        // Sort table data by position (default table ordering)
                        tableData.sort(sortIndicators);
                        // Columns to be fixed in tables: Indicator, Area, Units
                        var indicator = tableColumns[1];
                        var area = tableColumns[2];
                        var units = tableColumns[3];
                        // Get array of columns minus fixed columns
                        var columns = tableColumns.slice(4);
                        // Split columns into arrays with max length of 7
                        var tableHeaders = splitTable(columns, 7);
                        var newTables = [];
                        // Add fixed columns to the new table headers and create a new table for each header
                        tableHeaders.forEach(function (header) {
                            header.unshift(indicator, area, units);
                            var html = '<table class="dataTable no-footer"><tr>';
                            header.forEach(function (col) {
                                html += '<td>' + col.title + '</td>';
                            });
                            html += '</tr>';
                            newTables.push(html);
                        });
                        // Add data from indicators to each new table
                        tableData.forEach(function (ind, index) {
                            var obsCounter = 0;
                            var observations = Object.keys(ind.observations);
                            // Sort observations keys to match order of table date columns
                            var sortedObs = sortObsDates(observations, dateArray);
                            for (var i = 0; i < newTables.length; i++) {
                                var table = newTables[i];
                                table += '<tr><td>' + ind.indicator + '</td><td>' + ind.region + '</td><td>' + ind.units + '</td>';
                                var colCount = 3;
                                while (colCount < 10 && obsCounter < sortedObs.length) {
                                    table += '<td>' + ind.observations[sortedObs[obsCounter]] + '</td>';
                                    colCount += 1;
                                    obsCounter += 1;
                                }
                                // Add source
                                if (colCount < 10 && obsCounter === sortedObs.length) {
                                    table += '<td>' + ind.source + '</td></tr>';
                                }
                                if (index === tableData.length - 1) {
                                    table += '</table>';
                                }
                                newTables[i] = table;
                            }
                        });
                        // Original table
                        var dtTable = __WEBPACK_IMPORTED_MODULE_2_jquery__(win.document.body).find('table');
                        newTables.forEach(function (table) {
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(win.document.body).append('<br>');
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(win.document.body).append(table);
                        });
                        // Remove original table from print
                        dtTable.remove();
                        var $tables = __WEBPACK_IMPORTED_MODULE_2_jquery__(win.document.body).find('table');
                        $tables.each(function (i, table) {
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(table).find('tr:odd').each(function () {
                                __WEBPACK_IMPORTED_MODULE_2_jquery__(this).css('background-color', '#F9F9F9');
                            });
                            __WEBPACK_IMPORTED_MODULE_2_jquery__(table).find('td').each(function () {
                                __WEBPACK_IMPORTED_MODULE_2_jquery__(this).css('text-align', 'right');
                                __WEBPACK_IMPORTED_MODULE_2_jquery__(this).css('width', '10%');
                            });
                        });
                        __WEBPACK_IMPORTED_MODULE_2_jquery__(win.document.body)
                            .find('br:last-child')
                            .after('<p>Compiled by Research & Economic Analysis Division, State of Hawaii Department of Business, Economic Development and Tourism. For more information, please visit: http://dbedt.hawaii.gov/economic</p>');
                    }
                }],
            columns: tableColumns,
            columnDefs: [
                // Hide ID column -- used for initial ordering
                { 'visible': false, 'targets': 0 },
                { 'className': 'td-left', 'targets': [1, 2, 3] },
                { 'className': 'td-right', 'targets': '_all',
                    'render': function (data, type, row, meta) {
                        // If no data is available for a given year, return an empty string
                        return data === undefined ? ' ' : data;
                    }
                }
            ],
            scrollY: '400px',
            scrollX: true,
            paging: false,
            searching: false,
            info: false,
            fixedColumns: {
                'leftColumns': 4
            },
        });
        __WEBPACK_IMPORTED_MODULE_2_jquery__('span.loading').css('display', 'none');
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], IndicatorTableComponent.prototype, "dateArray", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], IndicatorTableComponent.prototype, "tableData", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], IndicatorTableComponent.prototype, "datesSelected", void 0);
    IndicatorTableComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-indicator-table',
            template: __webpack_require__(750),
            styles: [__webpack_require__(733)],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* ViewEncapsulation */].None
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* ApiService */]) === 'function' && _a) || Object])
    ], IndicatorTableComponent);
    return IndicatorTableComponent;
    var _a;
}());
//# sourceMappingURL=indicator-table.component.js.map

/***/ }),

/***/ 552:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MonthSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MonthSelectorComponent = (function () {
    function MonthSelectorComponent() {
        this.selectedMonthChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    MonthSelectorComponent.prototype.ngOnInit = function () {
    };
    MonthSelectorComponent.prototype.onChange = function (newMonth) {
        this.selectedMonth = this.months.find(function (month) { return month === newMonth; });
        this.selectedMonthChange.emit(this.selectedMonth);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], MonthSelectorComponent.prototype, "months", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], MonthSelectorComponent.prototype, "selectedMonth", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', Object)
    ], MonthSelectorComponent.prototype, "selectedMonthChange", void 0);
    MonthSelectorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-month-selector',
            template: __webpack_require__(751),
            styles: [__webpack_require__(734)]
        }), 
        __metadata('design:paramtypes', [])
    ], MonthSelectorComponent);
    return MonthSelectorComponent;
}());
//# sourceMappingURL=month-selector.component.js.map

/***/ }),

/***/ 553:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuarterSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QuarterSelectorComponent = (function () {
    function QuarterSelectorComponent() {
        this.selectedQuarterChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    QuarterSelectorComponent.prototype.ngOnInit = function () {
    };
    QuarterSelectorComponent.prototype.onChange = function (newQuarter) {
        this.selectedQuarter = this.quarters.find(function (quarters) { return quarters === newQuarter; });
        this.selectedQuarterChange.emit(this.selectedQuarter);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], QuarterSelectorComponent.prototype, "quarters", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], QuarterSelectorComponent.prototype, "selectedQuarter", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', Object)
    ], QuarterSelectorComponent.prototype, "selectedQuarterChange", void 0);
    QuarterSelectorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-quarter-selector',
            template: __webpack_require__(752),
            styles: [__webpack_require__(735)]
        }), 
        __metadata('design:paramtypes', [])
    ], QuarterSelectorComponent);
    return QuarterSelectorComponent;
}());
//# sourceMappingURL=quarter-selector.component.js.map

/***/ }),

/***/ 554:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return YearSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var YearSelectorComponent = (function () {
    function YearSelectorComponent() {
        this.selectedYearChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    YearSelectorComponent.prototype.ngOnInit = function () {
    };
    YearSelectorComponent.prototype.onChange = function (newYear) {
        this.selectedYear = this.years.find(function (year) { return year === newYear; });
        this.selectedYearChange.emit(this.selectedYear);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], YearSelectorComponent.prototype, "years", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], YearSelectorComponent.prototype, "selectedYear", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], YearSelectorComponent.prototype, "rangeLabel", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Output */])(), 
        __metadata('design:type', Object)
    ], YearSelectorComponent.prototype, "selectedYearChange", void 0);
    YearSelectorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Component */])({
            selector: 'app-year-selector',
            template: __webpack_require__(753),
            styles: [__webpack_require__(736)]
        }), 
        __metadata('design:paramtypes', [])
    ], YearSelectorComponent);
    return YearSelectorComponent;
}());
//# sourceMappingURL=year-selector.component.js.map

/***/ }),

/***/ 555:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 729:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "#wrapper {\n  width: 960px;\n  overflow-x: auto;\n  overflow-y: hidden; }\n  #wrapper .indicators {\n    border-right: 1px solid #3096A1;\n    width: 250px;\n    display: inline-block; }\n    #wrapper .indicators h6 {\n      margin: 0.5em;\n      font-size: 0.9rem; }\n  #wrapper .content-col {\n    width: 705px;\n    display: inline-block;\n    vertical-align: top; }\n  #wrapper .loading {\n    font-size: 0.8em;\n    color: #1D667F;\n    position: relative;\n    top: 50%;\n    text-align: center; }\n  #wrapper .btn {\n    line-height: 1;\n    border-radius: 0;\n    cursor: pointer; }\n  #wrapper .clear-table {\n    float: right;\n    margin-bottom: -1.75em; }\n  #wrapper .welcome-msg {\n    width: 80%;\n    margin-top: 5%;\n    margin-left: 10px; }\n    #wrapper .welcome-msg p {\n      margin-bottom: 0.5rem;\n      font-size: 1.1em; }\n    #wrapper .welcome-msg .dbedt {\n      font-size: 1rem;\n      color: #ED7D31;\n      font-weight: 600; }\n\n.selectors {\n  margin-top: 1em; }\n  .selectors .btn {\n    line-height: 1;\n    border-radius: 0;\n    cursor: pointer;\n    background-color: #29A8B4;\n    color: #FFFFFF; }\n  .selectors p {\n    display: inline-block; }\n  .selectors .text-danger {\n    margin-bottom: 0; }\n  .selectors .dropdown {\n    display: inline-block;\n    vertical-align: top; }\n  .selectors #area-selector {\n    margin-left: 5px;\n    margin-right: 15px; }\n  .selectors #freq-selector {\n    margin-right: 15px; }\n  .selectors .get-data {\n    display: inline-block;\n    float: right; }\n    .selectors .get-data .btn {\n      line-height: 1;\n      border-radius: 0;\n      cursor: pointer;\n      background-color: #29A8B4;\n      color: #FFFFFF; }\n    .selectors .get-data .loading {\n      display: none; }\n      .selectors .get-data .loading i {\n        font-size: 2em !important;\n        vertical-align: middle;\n        color: #29A8B4; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 730:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, ".sidebar {\n  height: 440px;\n  overflow: auto;\n  margin-left: 5px; }\n  .sidebar .node-content-wrapper {\n    padding: 0px 5px; }\n  .sidebar .bold-selected {\n    font-weight: 600; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 731:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 732:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "/* span {\r\n    display: inline-block;\r\n    vertical-align: top;\r\n}\r\n\r\n.multi-select {\r\n    display: inline-block;\r\n    border: 1px solid #ABABAB;\r\n    background-color: #FFFFFF;\r\n    width: 180px;\r\n    height: 100px;\r\n    font-family: 'Lucida Sans', sans-serif;\r\n    font-size: 0.8em;\r\n\r\n    label, label span {\r\n        display: block;\r\n        width: 100%;\r\n        margin-bottom: 0;\r\n    }\r\n\r\n    input[type=\"checkbox\"] {\r\n        opacity: 0;\r\n        position: absolute;\r\n    }\r\n\r\n    :checked + span {\r\n        background: #0481B9;\r\n        color: #FFFFFF;\r\n    }\r\n} */\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 733:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "table.dataTable {\n  font-size: 0.95em; }\n  table.dataTable thead th {\n    white-space: nowrap;\n    border-bottom: 0; }\n  table.dataTable thead th.td-right {\n    text-align: right; }\n  table.dataTable tbody td {\n    white-space: nowrap;\n    padding: 3px 10px; }\n  table.dataTable tbody td.td-right {\n    text-align: right; }\n\ntable.dataTable.no-footer {\n  border-bottom: 0; }\n\n.datatbles_wrapper, .no-footer {\n  height: 0;\n  overflow: visible; }\n  .datatbles_wrapper .dt-buttons, .no-footer .dt-buttons {\n    width: 200px; }\n    .datatbles_wrapper .dt-buttons .dt-button, .no-footer .dt-buttons .dt-button {\n      font-size: 16pt;\n      color: #000000;\n      padding: 0 0.25em; }\n  .datatbles_wrapper .DTFC_ScrollWrapper .DTFC_RightBodyLiner, .no-footer .DTFC_ScrollWrapper .DTFC_RightBodyLiner {\n    overflow-y: hidden !important; }\n\n.dataTables_wrapper.no-footer .dataTables_scrollBody {\n  border-bottom: none; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 734:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 735:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 736:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(27)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 746:
/***/ (function(module, exports) {

module.exports = "<div id=\"wrapper\">\r\n      <div class=\"indicators\">\r\n        <h6>Indicator</h6>\r\n        <app-category-sidebar (selectedCatIds)=\"getSelectedIndicators($event)\"></app-category-sidebar>\r\n      </div>\r\n      <div class=\"content-col\">\r\n          <button type=\"button\" class=\"btn btn-secondary clear-table\" (click)=\"clearSelections()\">Clear All Selections</button>\r\n        <div *ngIf=\"!displayTable\" class=\"welcome-msg\">\r\n          <h5 class=\"dbedt\">Welcome to the DBEDT Data Warehouse</h5>\r\n          <p>Please select indicator(s), frequency(s), period, and area(s) to get data.</p>\r\n          <p>Once you complete the selections, press the \"Get Data\" button.</p>\r\n          <p>If no data appears after you have completed your selection, please check that you have made the proper selections\r\n            such as the “From…” date is earlier than the “To….” date.</p>\r\n          <p>If you modify your selection, the table will be updated automatically after each modification. If you would like\r\n            to start a new data query, press the “Clear All Selections” button.</p>\r\n          <p>This Data Warehouse site works best in Chrome.  For assistance, please contact the Research & Economic Analysis Division, DBEDT at 808-586-2466.</p>\r\n\r\n        </div>\r\n        <app-indicator-table *ngIf=\"displayTable\" [dateArray]=\"dateArray\" [tableData]=\"tableData\"></app-indicator-table>\r\n      </div>\r\n      <div class=\"selectors\">\r\n        <app-geo-selector id=\"area-selector\" class=\"dropdown\" [indicator]=\"indicatorSelected\" [regions]=\"regions\" [(selectedGeos)]=\"selectedGeos\" (selectedGeoList)=\"geoChange($event)\"></app-geo-selector>\r\n        <app-freq-selector id=\"freq-selector\" class=\"dropdown\" [indicator]=\"indicatorSelected\" [freqs]=\"frequencies\" [(selectedFreqs)]=\"selectedFreqs\" (selectedFreqList)=\"freqChange($event)\"></app-freq-selector>\r\n        <app-year-selector class=\"dropdown\" *ngIf=\"annualSelected && !noSeries\" [rangeLabel]=\"'From'\" [years]=\"datesSelected.fromYearList\" [(selectedYear)]=\"datesSelected.selectedStartYear\"\r\n          (selectedYearChange)=\"startYearChange($event)\"></app-year-selector>\r\n        <app-quarter-selector class=\"dropdown\" *ngIf=\"quarterSelected && !noSeries\" [quarters]=\"datesSelected.fromQuarterList\"\r\n          [(selectedQuarter)]=\"datesSelected.selectedStartQuarter\" (selectedQuarterChange)=\"startQuarterChange($event)\"></app-quarter-selector>\r\n        <app-month-selector class=\"dropdown\" *ngIf=\"monthSelected && !noSeries\" [months]=\"datesSelected.fromMonthList\"\r\n          [(selectedMonth)]=\"datesSelected.selectedStartMonth\" (selectedMonthChange)=\"startMonthChange($event)\"></app-month-selector>\r\n        <app-year-selector class=\"dropdown\" *ngIf=\"annualSelected && !noSeries\" [rangeLabel]=\"'To'\" [years]=\"datesSelected.toYearList\" [(selectedYear)]=\"datesSelected.selectedEndYear\"\r\n          (selectedYearChange)=\"endYearChange($event)\"></app-year-selector>\r\n        <app-quarter-selector class=\"dropdown\" *ngIf=\"quarterSelected && !noSeries\" [quarters]=\"datesSelected.toQuarterList\"\r\n          [(selectedQuarter)]=\"datesSelected.selectedEndQuarter\" (selectedQuarterChange)=\"endQuarterChange($event)\"></app-quarter-selector>\r\n        <app-month-selector class=\"dropdown\" *ngIf=\"monthSelected && !noSeries\" [months]=\"datesSelected.toMonthList\"\r\n          [(selectedMonth)]=\"datesSelected.selectedEndMonth\" (selectedMonthChange)=\"endMonthChange($event)\"></app-month-selector>\r\n        <p class=\"text-danger\" *ngIf=\"invalidDates\">{{invalidDates}}</p>\r\n        <p class=\"text-danger\" *ngIf=\"noSeries\">{{noSeries}}</p>\r\n        <div class=\"get-data\">\r\n          <span class=\"loading\"><i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\" aria-hidden=\"true\"></i></span>\r\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"showTable()\" [disabled]=\"checkSelections()\">Get Data</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n"

/***/ }),

/***/ 747:
/***/ (function(module, exports) {

module.exports = "<div class=\"sidebar\">\r\n\t<Tree #tree [nodes]=\"nodes\"\r\n\t\t[options]=\"options\"\r\n    \t(onActivate)=\"activateNode($event)\"\r\n    \t(onDeactivate)=\"deactivateNode($event)\">\r\n\t</Tree>\r\n</div>"

/***/ }),

/***/ 748:
/***/ (function(module, exports) {

module.exports = "<span class=\"multi-select-label\">Frequency</span>\r\n<div class=\"freq-multi-select multi-select\">\r\n    <span *ngIf=\"!indicator\">Select an indicator</span>\r\n    <template ngFor let-freq [ngForOf]=\"freqs\">\r\n        <label><input type=\"checkbox\" name=\"checkbox\" value=\"{{freq.id}}\" [(ngModel)]=\"freq.state\" (ngModelChange)=\"toggle(freq.id, $event)\">\r\n        <span>{{freq.text}}</span></label>\r\n    </template>\r\n</div>\r\n"

/***/ }),

/***/ 749:
/***/ (function(module, exports) {

module.exports = "<span class=\"multi-select-label\">Area</span>\r\n<div class=\"area-multi-select multi-select\">\r\n    <span *ngIf=\"!indicator\">Select an indicator</span>\r\n    <template ngFor let-region [ngForOf]=\"regions\">\r\n        <label><input type=\"checkbox\" name=\"checkbox\" value=\"{{region.id}}\" [(ngModel)]=\"region.state\" (ngModelChange)=\"toggle(region.id, $event)\"><span>{{region.text}}</span></label>\r\n    </template>\r\n</div>"

/***/ }),

/***/ 750:
/***/ (function(module, exports) {

module.exports = "<table id=\"indicator-table\" width=\"100%\" class=\"stripe\">\r\n</table>"

/***/ }),

/***/ 751:
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\r\n  <label>Month</label>\r\n  <select [ngModel]=\"selectedMonth\" (ngModelChange)=\"onChange($event)\" class=\"custom-select\">\r\n    <option [ngValue]=\"month\" *ngFor=\"let month of months\">{{month}}</option>\r\n  </select>\r\n</div>"

/***/ }),

/***/ 752:
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\r\n  <label>Quarter</label>\r\n  <select [ngModel]=\"selectedQuarter\" (ngModelChange)=\"onChange($event)\" class=\"custom-select\">\r\n    <option [ngValue]=\"quarter\" *ngFor=\"let quarter of quarters\">{{quarter}}</option>\r\n  </select>\r\n</div>"

/***/ }),

/***/ 753:
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\r\n  <label>{{rangeLabel}} Year</label>\r\n  <select [ngModel]=\"selectedYear\" (ngModelChange)=\"onChange($event)\" class=\"custom-select\">\r\n    <option [ngValue]=\"year\" *ngFor=\"let year of years\">{{year}}</option>\r\n  </select>\r\n</div>"

/***/ })

},[1040]);
//# sourceMappingURL=main.bundle.js.map