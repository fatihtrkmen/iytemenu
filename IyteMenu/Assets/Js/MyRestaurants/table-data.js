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

        function toggleSwitch(switch_elem, on) {
            if (on) { // turn it on
                if ($(switch_elem)[0].checked) { // it already is so do 
                    // nothing
                } else {
                    $(switch_elem).trigger('click').attr("checked", "checked"); // it was off, turn it on
                }
            } else { // turn it off
                if ($(switch_elem)[0].checked) { // it's already on so 
                    $(switch_elem).trigger('click').removeAttr("checked"); // turn it off
                } else { // otherwise 
                    // nothing, already off
                }
            }
        }


        var table = $('#example').DataTable({
            "columnDefs": [
                            { "visible": false, "targets": 0 },
                            { "visible": false, "targets": 1 }
            ],
            "iDisplayLength": 25,
            "bDestroy": true,
            "bJQueryUI": true,
            "sPaginationType": "full_numbers",
            "fnDrawCallback": function () {
                $("#example a").click(function (event) {
                    debugger;
                    rowId = this.id;
                    var data = table.row(this.id).data();

                    $.ajax({
                        type: "POST",
                        url: "/MyRestaurants/getRestaurant",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify({ _Id: this.id }),
                        success: function (res) {
                            var data = JSON.parse(res);
                            $('#editRestaurantModal #Id').val(data.Id);
                            $('#editRestaurantModal #Name').val(data.Name);
                            $('#editRestaurantModal #Star').val(data.Star);
                            $('#editRestaurantModal #Comments').val(data.Comments);
                            if (data.Address) { toggleSwitch("#editRestaurantModal #Address", true); } else { toggleSwitch("#Address", false); }
                            if (data.Delivery) { toggleSwitch("#editRestaurantModal #Delivery", true); } else { toggleSwitch("#Delivery", false); }
                            if (data.IsPopular) { toggleSwitch("#IsPopular", true); } else { toggleSwitch("#IsPopular", false); }
                            if (data.CreditCardBankCard) { toggleSwitch("#editRestaurantModal #CreditCardBankCard", true); } else { toggleSwitch("#CreditCardBankCard", false); }
                            $('#editRestaurantModal #OpeningTime').val(data.OpeningTime);
                            $('#editRestaurantModal #MinimumFoodCost').val(data.MinimumFoodCost);
                            if (data.Sodexo) { toggleSwitch("#editRestaurantModal #Sodexo", true); } else { toggleSwitch("#Sodexo", false); }
                            if (data.TicketRestaurantCard) { toggleSwitch("#editRestaurantModal #TicketRestaurantCard", true); } else { toggleSwitch("#TicketRestaurantCard", false); }
                            if (data.Nakit) { toggleSwitch("#editRestaurantModal #Nakit", true); } else { toggleSwitch("#Nakit", false); }
                            if (data.Multinet) { toggleSwitch("#editRestaurantModal #Multinet", true); } else { toggleSwitch("#Multinet", false); }
                            if (data.SetCard) { toggleSwitch("#editRestaurantModal #SetCard", true); } else { toggleSwitch("#SetCard", false); }
                            $('#editRestaurantModal #CloseTime').val(data.CloseTime);
                            $('#editRestaurantModal').modal('show');
                        },
                        failure: function (errMsg) {
                            alert(errMsg);
                        }
                    });



                });
            }
        });
        var rowId;



        $("#editRestaurantModal #Kaydet").click(function (event) {
            
            $.ajax({
                type: "POST",
                url: "/MyRestaurants/EditRestaurant",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#editRestaurantModal #Id").val(), Name: $("#editRestaurantModal #Name").val(), Explanation: $("#editRestaurantModal #Explanation").val() }),
                success: function (data) {
                    $('#editRestaurantModal').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");

                        var data = table.row(rowId).data();
                        data[1]=$('#editRestaurantModal #Id').val();
                        data[2]=$('#editRestaurantModal #Name').val();
                        data[3]=$('#editRestaurantModal #Star').val();
                        data[4]=$('#editRestaurantModal #Comments').val();
                        data[5]=$('#editRestaurantModal #Address').val();
                        data[6]=$('#editRestaurantModal #Delivery').val();
                        data[7]=$('#editRestaurantModal #IsPopular').val();
                        data[8]=$('#editRestaurantModal #CreditCardBankCard').val();
                        data[9]=$('#editRestaurantModal #OpeningTime').val();
                        data[10]=$('#editRestaurantModal #MinimumFoodCost').val();
                        data[11]=$('#editRestaurantModal #Sodexo').val();
                        data[12]=$('#editRestaurantModal #TicketRestaurantCard').val();
                        data[13]=$('#editRestaurantModal #Nakit').val();
                        data[14]=$('#editRestaurantModal #Multinet').val();
                        data[15]=$('#editRestaurantModal #SetCard').val();
                        data[16]=$('#editRestaurantModal #CloseTime').val();

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


        $('#newRestaurant').click(function () {
            $('#newRestaurantModal').modal('show');
        });

        $('#newRestaurantModal #Kaydet').click(function () {
            $.ajax({
                type: "POST",
                url: "/MyRestaurants/AddRestaurant",
                // The key needs to match your method's input parameter (case-sensitive).
                //data: JSON.stringify({ Markers: markers }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Id: $("#newRestaurantModal #Id").val(), Name: $("#newRestaurantModal #Name").val(), Explanation: $("#newRestaurantModal #Explanation").val() }),
                success: function (data) {
                    $('#newRestaurantModal').modal('hide');
                    var res = JSON.parse(data);
                    if (res.resCode == 1) {
                        alert("Islem Basarili");
                        window.location = '/MyRestaurants/Index';
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
    $('#example-editable').DataTable({
        "columnDefs": [
                        { "visible": false, "targets": 0 },
                        { "visible": false, "targets": 1 }
        ],
    });
});