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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "POST Login 7"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 8"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 9"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 10"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 10"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 10"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 7"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 10"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 5"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 4"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 3"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 10"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 2"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact"], "isController": true}, {"data": [1.0, 500, 1500, "PUT Contact 1"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 1"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 2"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 3"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 4"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 5"], "isController": false}, {"data": [0.5, 500, 1500, "POST Login 6"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 9"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 1"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 2"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 1"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 3"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 4"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 3"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact 10"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 2"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 5"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 4"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 7"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 9"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 7"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 4"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 5"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact"], "isController": true}, {"data": [1.0, 500, 1500, "PATCH Contact 2"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 3"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 1"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 1"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 2"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 5"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 3"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 4"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 9"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 7"], "isController": false}, {"data": [1.0, 500, 1500, "ADD Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact 9"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 5"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 6"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 7"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 8"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact 9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 396.93333333333334, 255, 1077, 266.0, 1052.0, 1072.6, 1077.0, 5.29567519858782, 5.408587544130627, 3.390818071491615], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Login 7", 1, 0, 0.0, 1077.0, 1077, 1077, 1077.0, 1077.0, 1077.0, 1077.0, 0.9285051067780873, 1.1434032613741876, 0.25842183147632314], "isController": false}, {"data": ["POST Login 8", 1, 0, 0.0, 1029.0, 1029, 1029, 1029.0, 1029.0, 1029.0, 1029.0, 0.9718172983479105, 1.2081283406219632, 0.27047649416909625], "isController": false}, {"data": ["POST Login 9", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 1.1993704490291262, 0.27021389563106796], "isController": false}, {"data": ["DELETE Contact 10", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 2.6461693548387095, 2.296146953405018], "isController": false}, {"data": ["PATCH Contact 10", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9283608490566038, 2.505896226415094], "isController": false}, {"data": ["POST Login 10", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 1.18522166746872, 0.26787325553416746], "isController": false}, {"data": ["PUT Contact 8", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.9842264733840302, 3.490375475285171], "isController": false}, {"data": ["PUT Contact 7", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.880647237827715, 3.4380852059925093], "isController": false}, {"data": ["PUT Contact 6", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.9099075374531833, 3.4380852059925093], "isController": false}, {"data": ["GET Contact 10", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.9665781853281854, 1.953125], "isController": false}, {"data": ["PUT Contact 5", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.909921287593985, 3.4510103383458643], "isController": false}, {"data": ["PUT Contact 4", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 3.714425223214285, 3.278459821428571], "isController": false}, {"data": ["PUT Contact 3", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 3.715785682624114, 3.2552083333333335], "isController": false}, {"data": ["ADD Contact 10", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 3.939796040076336, 3.1868738072519083], "isController": false}, {"data": ["PUT Contact 2", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 3.939541903409091, 3.477154356060606], "isController": false}, {"data": ["ADD Contact", 10, 0, 0.0, 265.19999999999993, 260, 269, 265.0, 268.9, 269.0, 269.0, 1.0887316276537835, 1.1289211350027217, 0.9090483805117038], "isController": true}, {"data": ["PUT Contact 1", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.880742770522388, 3.425256529850746], "isController": false}, {"data": ["POST Login 1", 1, 0, 0.0, 1077.0, 1077, 1077, 1077.0, 1077.0, 1077.0, 1077.0, 0.9285051067780873, 1.1434032613741876, 0.25842183147632314], "isController": false}, {"data": ["POST Login 2", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 1.1742885575095057, 0.2645630346958175], "isController": false}, {"data": ["POST Login 3", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 1.158587197110904, 0.2593851933830382], "isController": false}, {"data": ["POST Login 4", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 1.1599545187793427, 0.2613336267605634], "isController": false}, {"data": ["POST Login 5", 1, 0, 0.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 1.164327580113101, 0.2623188619227144], "isController": false}, {"data": ["POST Login 6", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 1.1780017229087452, 0.2645630346958175], "isController": false}, {"data": ["PUT Contact 9", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.909921287593985, 3.4510103383458643], "isController": false}, {"data": ["DELETE Contact 1", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.8178673664122136, 2.4451335877862594], "isController": false}, {"data": ["DELETE Contact 2", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.7839319029850746, 2.390391791044776], "isController": false}, {"data": ["GET Contact 1", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.9665781853281854, 1.953125], "isController": false}, {"data": ["DELETE Contact 3", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.7965198863636362, 2.426609848484848], "isController": false}, {"data": ["DELETE Contact 4", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.754780783582089, 2.390391791044776], "isController": false}, {"data": ["GET Contact 3", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.9508079847908744, 1.9234196768060836], "isController": false}, {"data": ["PUT Contact 10", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.969857519157088, 3.5171216475095783], "isController": false}, {"data": ["GET Contact 2", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.951149425287356, 1.9381585249042146], "isController": false}, {"data": ["GET Contact 5", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 3.936068702290076, 1.9307609732824427], "isController": false}, {"data": ["GET Contact 4", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.891509433962264, 1.9089033018867922], "isController": false}, {"data": ["GET Contact 7", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.833372201492537, 1.8875349813432836], "isController": false}, {"data": ["GET Contact 6", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.996742277992278, 1.953125], "isController": false}, {"data": ["GET Contact 9", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 4.044117647058823, 1.9837622549019607], "isController": false}, {"data": ["GET Contact 8", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 4.027374031007752, 1.9606952519379846], "isController": false}, {"data": ["PATCH Contact 6", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.9433816539923954, 2.5249524714828895], "isController": false}, {"data": ["PATCH Contact 7", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.8989893122676578, 2.4686338289962824], "isController": false}, {"data": ["PATCH Contact 4", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.8556134259259256, 2.4594907407407405], "isController": false}, {"data": ["PATCH Contact 5", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9431014150943393, 2.505896226415094], "isController": false}, {"data": ["GET Contact", 10, 0, 0.0, 260.9, 255, 268, 260.0, 267.7, 268.0, 268.0, 1.0894432944765224, 1.1243395250027235, 0.5511051040418347], "isController": true}, {"data": ["PATCH Contact 2", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.8278398722627736, 2.4235857664233573], "isController": false}, {"data": ["PATCH Contact 3", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.884386660447761, 2.477845149253731], "isController": false}, {"data": ["PATCH Contact 1", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.9582343155893533, 2.5249524714828895], "isController": false}, {"data": ["ADD Contact 1", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 3.9099491003787876, 3.1627308238636362], "isController": false}, {"data": ["ADD Contact 2", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.909935141509434, 3.1507959905660377], "isController": false}, {"data": ["ADD Contact 5", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.880647237827715, 3.12719452247191], "isController": false}, {"data": ["ADD Contact 6", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9246757075471694, 3.1507959905660377], "isController": false}, {"data": ["ADD Contact 3", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.880837592936803, 3.103944005576208], "isController": false}, {"data": ["ADD Contact 4", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.880647237827715, 3.12719452247191], "isController": false}, {"data": ["ADD Contact 9", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 3.9851262019230766, 3.2113882211538463], "isController": false}, {"data": ["ADD Contact 7", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.851591651119403, 3.1155258861940296], "isController": false}, {"data": ["ADD Contact 8", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9394162735849054, 3.1507959905660377], "isController": false}, {"data": ["PATCH Contact 8", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.98856561302682, 2.544300766283525], "isController": false}, {"data": ["PATCH Contact 9", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 3.9888822115384612, 2.5540865384615383], "isController": false}, {"data": ["DELETE Contact 5", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 2.7590613382899627, 2.3815055762081783], "isController": false}, {"data": ["DELETE Contact 6", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 2.8136973180076628, 2.4545019157088124], "isController": false}, {"data": ["DELETE Contact 7", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.7839319029850746, 2.390391791044776], "isController": false}, {"data": ["DELETE Contact 8", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 2.8726896887159534, 2.492704280155642], "isController": false}, {"data": ["DELETE Contact 9", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.8029580152671754, 2.4451335877862594], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
