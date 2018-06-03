function childCheck(data){
    var isHave = false;
    $.each(data,function(k,v){
        if(typeof v === 'object'){
            isHave = v.length;
        }
    });
    return isHave;
}


(function ($) {
    $.json2excel = function (jsonData, paramStyle) {
        var id = "json_data_explode";

        var html = '<table id="' + id + '" style="display:none;">';

        var style = '<style>';
        $.each(paramStyle, function (k, v) {
            style += k + v;
        });
        style += '</style>';
        style = style.replace(',', ';');

        var head = '<thead><tr>';
        $.each(jsonData.head, function (k, v) {
            head += '<td class="th_head">' + v + '</td>';
        });
        head += '</tr></thead>';

        var body = '<tbody>';
        $.each(jsonData.body,function(k,v){
            var length = childCheck(v);
            if(!length){
                body += '<tr>';
                $.each(v,function(key,value){
                    body += '<td>'+value+'</td>';
                });
                body += '</tr>';
            }else{
                for(var i = 0; i < length ;i++){
                    body += '<tr>';
                    if(i == 0){
                        $.each(v,function(key,value){
                            if(typeof value === 'object'){
                                body += '<td>' + value[0] + '</td>';
                            }else {
                                body += '<td rowspan="'+length+'">' + value + '</td>';
                            }
                        });
                    }else{
                        $.each(v,function(key,value){
                            if(typeof value === 'object'){
                                body += '<td>' + value[i] + '</td>';
                            }
                        });
                    }
                    body += '</tr>';
                }
            }
        });
        body += '</tbody>';

        html += style;
        html += head;
        html += body;
        html += '</table>';

        $("body").append(html);
        $("#" + id).downloadData();
    };
})(jQuery);

(function ($) {
    $.fn.downloadData = function () {
        var table = this[0].id;

        var uri = 'data:application/vnd.ms-excel;base64,'
            ,
            template =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
                ' xmlns="http://www.w3.org/TR/REC-html40">' +
                '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>' +
                '<body>' +
                '<table>{table}</table>' +
                '</body>' +
                '</html>'
            , base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            }
            , format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                    return c[p];
                })
            };
        if (!table.nodeType) {
            table = document.getElementById(table);
        }
        var ctx = {worksheet: 'W3C Example Table' || 'Worksheet', table: table.innerHTML};
        window.location.href = uri + base64(format(template, ctx));

        this.remove();
    };
})(jQuery);