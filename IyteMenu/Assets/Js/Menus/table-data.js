$(document).ready(function() {
    
    //ajax mocks
    $.mockjaxSettings.responseTime = 500; 
    
    $.mockjax({
        url: '/post',
        response: function(settings) {
            log(settings, this);
        }
    });

    $.mockjax({
        url: '/error',
        status: 400,
        statusText: 'Bad Request',
        response: function(settings) {
            this.responseText = 'Please input correct value'; 
            log(settings, this);
        }        
    });
    
    $.mockjax({
        url: '/status',
        status: 500,
        response: function(settings) {
            this.responseText = 'Internal Server Error';
            log(settings, this);
        }        
    });
  
    $.mockjax({
        url: '/groups',
        response: function(settings) {
            this.responseText = [ 
             {value: 0, text: 'Guest'},
             {value: 1, text: 'Service'},
             {value: 2, text: 'Customer'},
             {value: 3, text: 'Operator'},
             {value: 4, text: 'Support'},
             {value: 5, text: 'Admin'}
            ];
            log(settings, this);
        }        
    });
    
    function log(settings, response) {
        var s = [], str;
        s.push(settings.type.toUpperCase() + ' url = "' + settings.url + '"');
        for(var a in settings.data) {
            if(settings.data[a] && typeof settings.data[a] === 'object') {
                str = [];
                for(var j in settings.data[a]) {str.push(j+': "'+settings.data[a][j]+'"');}
                str = '{ '+str.join(', ')+' }';
            } else {
                str = '"'+settings.data[a]+'"';
            }
            s.push(a + ' = ' + str);
        }
        s.push('RESPONSE: status = ' + response.status);

        if(response.responseText) {
            if($.isArray(response.responseText)) {
                s.push('[');
                $.each(response.responseText, function(i, v){
                    s.push('{value: ' + v.value+', text: "'+v.text+'"}');
                }); 
                s.push(']');
            } else {
                s.push($.trim(response.responseText));
            }
        }
        s.push('--------------------------------------\n');
        $('#console').val(s.join('\n') + $('#console').val());
    }   
    
    //turn to inline mode
    $.fn.editable.defaults.mode = 'inline';
    
    //editables 
    $('#example-editable td a').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'username',
        title: 'Enter username'
    });
    
    // Datatables
    $(document).ready(function () {
        function blinkIt(oldClass){
            this.attr("class", oldClass);
        }



        var table = $('#example').DataTable({
            "columnDefs": [
                    { "visible": false, "targets": 0 },
                    { "visible": false, "targets": 1 },
                    { "visible": false, "targets": 5 },
                    { "visible": false, "targets": 6 }
            ],
            "sPaginationType": "full_numbers",
            "fnDrawCallback": function () {
                $("#example a").click(function (event) {
                    debugger;
                    rowId = this.id;
                    var data = table.row(this.id).data();
                    $('#mealDetails #Id').val(data[1]);
                    $('#mealDetails #Name').val(data[2]);
                    $('#mealDetails #Detail').val(data[3]);
                    $('#mealDetails #Price').val(data[4]);
                    $('#mealDetails #CategoryId').val(data[5]);
                    $('#mealDetails #RestaurantId').val(data[6]);
                    $('#mealDetails').modal('show');
                });
            }
        });
        var rowId;



        $("#mealDetails #Kaydet").click(function (event) {
            $.ajax({
                type: "POST",
                url: "/Meals/EditMeal",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#mealDetails #Id").val(), Name: $("#mealDetails #Name").val(), Detail: $("#mealDetails #Detail").val(), Price: $("#mealDetails #Price").val(), CategoryId: $("#mealDetails #CategoryId").val(), RestaurantId: $("#mealDetails #RestaurantId").val() }),
                success: function (data) {
                    $('#mealDetails').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");

                        var data = table.row(rowId).data();
                        data[1]=$('#mealDetails #Id').val();
                        data[2] = $('#mealDetails #Name').val();
                        data[3] = $('#mealDetails #Detail').val();
                        data[4] = $('#mealDetails #Price').val();
                        data[5] = $('#mealDetails #CategoryId').val();
                        data[6] = $('#mealDetails #RestaurantId').val();

                        table.row(rowId).data(data).draw();
                    }
                    else {
                        alert("Hata");
                    }
                },
                failure: function (errMsg) {
                    alert(errMsg);
                }
            });
        });


        $('#newMeal').click(function () {
            $('#newMealModal').modal('show');
        });

        $('#newMealModal #Kaydet').click(function () {
            $.ajax({
                type: "POST",
                url: "/Meals/AddMeal",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#newMealModal #Id").val(), Name: $("#newMealModal #Name").val(), Detail: $("#newMealModal #Detail").val(), Price: $("#newMealModal #Price").val(), CategoryId: $("#newMealModal #CategoryId").val(), RestaurantId: $("#newMealModal #RestaurantId").val() }),
                success: function (data) {
                    $('#newMealModal').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");

                        //var data = table.row(rowId).data();
                        //data[1] = $('#mealDetails #Id').val();
                        //data[2] = $('#mealDetails #Name').val();
                        //data[3] = $('#mealDetails #Detail').val();
                        //data[4] = $('#mealDetails #Price').val();
                        //data[5] = $('#mealDetails #CategoryId').val();
                        //data[6] = $('#mealDetails #RestaurantId').val();

                        //table.row(rowId).data(data).draw();
                        //debugger;
                        //var tr = table.row(rowId);


                        //var on = false;
                        //window.setInterval(function () {
                        //    on = !on;
                        //    if (on) {
                        //        $("#example > tbody > tr:nth-child(1) > td:nth-child(4)").addClass('invalid-blink');
                        //    } else {
                        //        $("#example > tbody > tr:nth-child(1) > td:nth-child(4)").removeClass('invalid-blink');
                        //    }
                        //}, 2000);


                    }
                    else {
                        alert("Hata");
                    }
                },
                failure: function (errMsg) {
                    alert(errMsg);
                }
            });
        });





    });




    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });
    $('#example1').DataTable({"columnDefs": [
            { "visible": false, "targets": 0 }
    ]});
    
    var table = $('#example2').DataTable({
        "columnDefs": [
            { "visible": false, "targets": 2 }
        ],
        "order": [[ 2, 'asc' ]],
        "displayLength": 25,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    } );
 
    // Order by the grouping
    $('#example2 tbody').on( 'click', 'tr.group', function () {
        var currentOrder = table.order()[0];
        if ( currentOrder[0] === 2 && currentOrder[1] === 'asc' ) {
            table.order( [ 2, 'desc' ] ).draw();
        }
        else {
            table.order( [ 2, 'asc' ] ).draw();
        }
    } );
    
    $.fn.isValid = function(){
        return this[0].checkValidity()
    }
    
    var t = $('#example3').DataTable();
 
    $('#add-row').on( 'click', function () {
        if($("#add-row-form").isValid()) {
            var name = $('#name-input').val(),
                position = $('#position-input').val(),
                age = $('#age-input').val(),
                date = $('#date-input').val(),
                salary = $('#salary-input').val();
            t.row.add( [
                name,
                position,
                age,
                date,
                '$' + salary
            ] ).draw();
            
            $('.modal').modal('hide');
            
            return false;
        }
    });
    
    $('.date-picker').datepicker({
        orientation: "top auto",
        autoclose: true
    });
});