/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9024390243902439, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Signoff"], "isController": false}, {"data": [0.5, 500, 1500, "Select Category"], "isController": true}, {"data": [1.0, 500, 1500, "Enter Home Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Home Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "PaymentDetails-0"], "isController": false}, {"data": [0.5, 500, 1500, "Select Product"], "isController": true}, {"data": [0.5, 500, 1500, "Logout"], "isController": true}, {"data": [0.5, 500, 1500, "Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Enter Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "RP-LI-02-1"], "isController": false}, {"data": [1.0, 500, 1500, "RP-LI-02-0"], "isController": false}, {"data": [1.0, 500, 1500, "EST-13"], "isController": false}, {"data": [1.0, 500, 1500, "Order form"], "isController": true}, {"data": [0.5, 500, 1500, "Home Page-1"], "isController": false}, {"data": [0.5, 500, 1500, "Select Working Item"], "isController": true}, {"data": [1.0, 500, 1500, "Home Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES-1"], "isController": false}, {"data": [1.0, 500, 1500, "RP-LI-02"], "isController": false}, {"data": [1.0, 500, 1500, "PaymentDetails-1"], "isController": false}, {"data": [1.0, 500, 1500, "EST-13-0"], "isController": false}, {"data": [1.0, 500, 1500, "EST-13-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login Page"], "isController": true}, {"data": [1.0, 500, 1500, "PaymentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Payload"], "isController": false}, {"data": [1.0, 500, 1500, "REPTILES"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 0, 0.0, 321.9999999999999, 138, 1151, 242.0, 660.0999999999998, 926.7499999999993, 1151.0, 4.945904173106646, 14.272906201700154, 3.744445517774343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Signoff", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 1.5054783424283766, 0.7247612551159618], "isController": false}, {"data": ["Select Category", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 11.367136169513797, 3.0592969776609724], "isController": true}, {"data": ["Enter Home Page-1", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 25.320536782296653, 2.625971889952153], "isController": false}, {"data": ["Enter Home Page-0", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 2.25830078125, 3.43017578125], "isController": false}, {"data": ["Login-0", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.2332017918088738, 2.2930887372013653], "isController": false}, {"data": ["Login-1", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 30.314700704225356, 4.339513644366198], "isController": false}, {"data": ["PaymentDetails-0", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.5415160123966942, 2.316309400826446], "isController": false}, {"data": ["Select Product", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 12.567934782608697, 3.25429523141655], "isController": true}, {"data": ["Logout", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 1.5054783424283766, 0.7247612551159618], "isController": true}, {"data": ["Home Page", 2, 0, 0.0, 1151.0, 1151, 1151, 1151.0, 1151.0, 1151.0, 1151.0, 1.6155088852988693, 2.822407613085622, 1.703857027463651], "isController": false}, {"data": ["Enter Home Page", 2, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 5.405405405405405, 30.558488175675677, 5.933277027027027], "isController": false}, {"data": ["RP-LI-02-1", 2, 0, 0.0, 187.0, 165, 209, 187.0, 209.0, 209.0, 209.0, 3.8910505836575875, 15.90618920233463, 2.257113326848249], "isController": false}, {"data": ["RP-LI-02-0", 2, 0, 0.0, 168.5, 138, 199, 168.5, 199.0, 199.0, 199.0, 3.6496350364963503, 1.4327668795620436, 2.1170734489051095], "isController": false}, {"data": ["EST-13", 2, 0, 0.0, 333.0, 292, 374, 333.0, 374.0, 374.0, 374.0, 2.9940119760479043, 16.133748128742514, 3.4793693862275448], "isController": false}, {"data": ["Order form", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 10.69433811247216, 2.496868040089087], "isController": true}, {"data": ["Home Page-1", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 1.7471502791563274, 0.6542726426799007], "isController": false}, {"data": ["Select Working Item", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 16.182197822822822, 3.489817942942943], "isController": true}, {"data": ["Home Page-0", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.993745417888563, 1.5464626099706744], "isController": false}, {"data": ["REPTILES-0", 2, 0, 0.0, 156.0, 148, 164, 156.0, 164.0, 164.0, 164.0, 3.838771593090211, 1.5145153550863724, 2.234285028790787], "isController": false}, {"data": ["Login", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 10.726472701149426, 2.9611170977011496], "isController": false}, {"data": ["REPTILES-1", 2, 0, 0.0, 224.0, 206, 242, 224.0, 242.0, 242.0, 242.0, 3.257328990228013, 12.803466001628665, 1.8958672638436482], "isController": false}, {"data": ["RP-LI-02", 2, 0, 0.0, 356.5, 304, 409, 356.5, 409.0, 409.0, 409.0, 2.8011204481792715, 12.550332633053221, 3.2497373949579833], "isController": false}, {"data": ["PaymentDetails-1", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 21.394738828502415, 2.707955917874396], "isController": false}, {"data": ["EST-13-0", 2, 0, 0.0, 172.0, 150, 194, 172.0, 194.0, 194.0, 194.0, 3.802281368821293, 1.4964056558935361, 2.2093334125475286], "isController": false}, {"data": ["EST-13-1", 2, 0, 0.0, 160.5, 142, 179, 160.5, 179.0, 179.0, 179.0, 4.2283298097251585, 21.121002906976745, 2.4568908562367864], "isController": false}, {"data": ["Login Page", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 10.726472701149426, 2.9611170977011496], "isController": true}, {"data": ["PaymentDetails", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 10.69433811247216, 2.496868040089087], "isController": false}, {"data": ["Payload", 2, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 4.0733197556008145, 2.9674770875763747, 2.553780549898167], "isController": false}, {"data": ["REPTILES", 2, 0, 0.0, 380.5, 355, 406, 380.5, 406.0, 406.0, 406.0, 2.6212319790301444, 11.337340268676277, 3.051277850589777], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
