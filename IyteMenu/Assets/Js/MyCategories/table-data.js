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
            "sPaginationType": "full_numbers",
            "fnDrawCallback": function () {
                $("#example a").click(function (event) {
                    debugger;
                    rowId = this.id;
                    var data = table.row(this.id).data();
                    $('#editCategoryModal #Id').val(data[1]);
                    $('#editCategoryModal #Name').val(data[2]);
                    $('#editCategoryModal #Explanation').val(data[3]);
                    $('#editCategoryModal').modal('show');
                });
            }
        });
        var rowId;



        $("#editCategoryModal #Kaydet").click(function (event) {
            $.ajax({
                type: "POST",
                url: "/MyCategories/EditCategory",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#editCategoryModal #Id").val(), Name: $("#editCategoryModal #Name").val(), Explanation: $("#editCategoryModal #Explanation").val() }),
                success: function (data) {
                    $('#editCategoryModal').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");

                        var data = table.row(rowId).data();
                        data[1] = $('#editCategoryModal #Id').val();
                        data[2] = $('#editCategoryModal #Name').val();
                        data[3] = $('#editCategoryModal #Explanation').val();

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


        $('#newCategory').click(function () {
            $('#newCategoryModal').modal('show');
        });

        $('#newCategoryModal #Kaydet').click(function () {
            $.ajax({
                type: "POST",
                url: "/MyCategories/AddCategory",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#newCategoryModal #Id").val(), Name: $("#newCategoryModal #Name").val(), Explanation: $("#newCategoryModal #Explanation").val() }),
                success: function (data) {
                    $('#newCategoryModal').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");
                        window.location = '/MyCategories/Index';
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
    $('#example-editable').DataTable();
});