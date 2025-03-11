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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 396.59999999999997, 254, 1076, 266.0, 1049.8, 1055.8, 1076.0, 5.302226935312832, 5.416314565659243, 3.395013145104277], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST Login 7", 1, 0, 0.0, 1029.0, 1029, 1029, 1029.0, 1029.0, 1029.0, 1029.0, 0.9718172983479105, 1.2081283406219632, 0.27047649416909625], "isController": false}, {"data": ["POST Login 8", 1, 0, 0.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 1.150883469626168, 0.26011244158878505], "isController": false}, {"data": ["POST Login 9", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 1.1705753921102662, 0.2645630346958175], "isController": false}, {"data": ["DELETE Contact 10", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.8545673076923075, 2.4639423076923075], "isController": false}, {"data": ["PATCH Contact 10", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 4.003532088122605, 2.544300766283525], "isController": false}, {"data": ["POST Login 10", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 1.1924242881274132, 0.2686489502895753], "isController": false}, {"data": ["PUT Contact 8", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.837528935185185, 3.399884259259259], "isController": false}, {"data": ["PUT Contact 7", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.909935141509434, 3.4640330188679243], "isController": false}, {"data": ["PUT Contact 6", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.909893889925373, 3.425256529850746], "isController": false}, {"data": ["GET Contact 10", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 4.075418307086614, 1.991572342519685], "isController": false}, {"data": ["PUT Contact 5", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 3.727738575268817, 3.290210573476702], "isController": false}, {"data": ["PUT Contact 4", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 3.74055166967509, 3.3139666064981945], "isController": false}, {"data": ["PUT Contact 3", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.895277387640449, 3.4380852059925093], "isController": false}, {"data": ["ADD Contact 10", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 3.9851262019230766, 3.2113882211538463], "isController": false}, {"data": ["PUT Contact 2", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.999079134980988, 3.490375475285171], "isController": false}, {"data": ["ADD Contact", 10, 0, 0.0, 265.3, 260, 274, 265.0, 273.6, 274.0, 274.0, 1.0834236186348862, 1.1229939734561214, 0.904616400325027], "isController": true}, {"data": ["PUT Contact 1", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 3.781960227272727, 3.3380681818181817], "isController": false}, {"data": ["POST Login 1", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 1.1728050595238095, 0.2650669642857143], "isController": false}, {"data": ["POST Login 2", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 1.1765252976190477, 0.2650669642857143], "isController": false}, {"data": ["POST Login 3", 1, 0, 0.0, 1056.0, 1056, 1056, 1056.0, 1056.0, 1056.0, 1056.0, 0.946969696969697, 1.1809377959280303, 0.26356090198863635], "isController": false}, {"data": ["POST Login 4", 1, 0, 0.0, 1076.0, 1076, 1076, 1076.0, 1076.0, 1076.0, 1076.0, 0.929368029739777, 1.14809624767658, 0.258662000464684], "isController": false}, {"data": ["POST Login 5", 1, 0, 0.0, 1046.0, 1046, 1046, 1046.0, 1046.0, 1046.0, 1046.0, 0.9560229445506692, 1.177289973709369, 0.26608060468451245], "isController": false}, {"data": ["POST Login 6", 1, 0, 0.0, 1048.0, 1048, 1048, 1048.0, 1048.0, 1048.0, 1048.0, 0.9541984732824427, 1.17877057490458, 0.26557281727099236], "isController": false}, {"data": ["PUT Contact 9", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.866316217472119, 3.4125232342007434], "isController": false}, {"data": ["DELETE Contact 1", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.840909090909091, 2.426609848484848], "isController": false}, {"data": ["DELETE Contact 2", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 2.704326923076923, 2.3466117216117213], "isController": false}, {"data": ["GET Contact 1", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.9816602316602316, 1.953125], "isController": false}, {"data": ["DELETE Contact 3", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 2.7712264150943393, 2.417452830188679], "isController": false}, {"data": ["DELETE Contact 4", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.754780783582089, 2.390391791044776], "isController": false}, {"data": ["GET Contact 3", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.951149425287356, 1.9381585249042146], "isController": false}, {"data": ["PUT Contact 10", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.999790469348659, 3.5171216475095783], "isController": false}, {"data": ["GET Contact 2", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 4.026906370656371, 1.953125], "isController": false}, {"data": ["GET Contact 5", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 3.936068702290076, 1.9307609732824427], "isController": false}, {"data": ["GET Contact 4", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.90625, 1.9234196768060836], "isController": false}, {"data": ["GET Contact 7", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 3.9974464980544746, 1.9683244163424125], "isController": false}, {"data": ["GET Contact 6", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 4.027374031007752, 1.9606952519379846], "isController": false}, {"data": ["GET Contact 9", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 3.9970930232558137, 1.9606952519379846], "isController": false}, {"data": ["GET Contact 8", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.8191217472118955, 1.88051812267658], "isController": false}, {"data": ["PATCH Contact 6", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.9578419811320753, 2.505896226415094], "isController": false}, {"data": ["PATCH Contact 7", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 3.8698111007462686, 2.477845149253731], "isController": false}, {"data": ["PATCH Contact 4", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 3.757642663043478, 2.4060235507246377], "isController": false}, {"data": ["PATCH Contact 5", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.9582343155893533, 2.5249524714828895], "isController": false}, {"data": ["GET Contact", 10, 0, 0.0, 260.0, 254, 269, 259.0, 268.4, 269.0, 269.0, 1.0848340203948796, 1.1200063733998697, 0.548773459535691], "isController": true}, {"data": ["PATCH Contact 2", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 3.987630208333333, 2.5153882575757573], "isController": false}, {"data": ["PATCH Contact 3", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.9135925751879697, 2.496475563909774], "isController": false}, {"data": ["PATCH Contact 1", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 3.8699465613382897, 2.4686338289962824], "isController": false}, {"data": ["ADD Contact 1", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.895194575471698, 3.1507959905660377], "isController": false}, {"data": ["ADD Contact 2", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 3.909935141509434, 3.1507959905660377], "isController": false}, {"data": ["ADD Contact 5", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 3.939796040076336, 3.1868738072519083], "isController": false}, {"data": ["ADD Contact 6", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 3.924745501893939, 3.1627308238636362], "isController": false}, {"data": ["ADD Contact 3", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 3.9245376872659175, 3.12719452247191], "isController": false}, {"data": ["ADD Contact 4", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 3.837528935185185, 3.0924479166666665], "isController": false}, {"data": ["ADD Contact 9", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.880550986842105, 3.138950892857143], "isController": false}, {"data": ["ADD Contact 7", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 4.015174278846153, 3.2113882211538463], "isController": false}, {"data": ["ADD Contact 8", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.7672502281021893, 3.047302691605839], "isController": false}, {"data": ["PATCH Contact 8", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 3.717237903225806, 2.380152329749104], "isController": false}, {"data": ["PATCH Contact 9", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 3.8413860701107008, 2.4504151291512914], "isController": false}, {"data": ["DELETE Contact 5", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 2.804863721804511, 2.408364661654135], "isController": false}, {"data": ["DELETE Contact 6", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.8368583650190113, 2.4358365019011408], "isController": false}, {"data": ["DELETE Contact 7", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 2.781723484848485, 2.426609848484848], "isController": false}, {"data": ["DELETE Contact 8", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 2.754780783582089, 2.390391791044776], "isController": false}, {"data": ["DELETE Contact 9", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 2.822005703422053, 2.4358365019011408], "isController": false}]}, function(index, item){
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
