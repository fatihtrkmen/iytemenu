$(document).ready(function() {
    
    var drag =  function() {
        $('.calendar-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 1111999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    });
    };
    
    var removeEvent =  function() {
        $('.remove-calendar-event').click(function() {
        $(this).closest('.calendar-event').fadeOut();
        return false;
    });
    };
    
    $("#menuEkle").click(function (e) {

        addMeal();

        debugger;
        //if ((!$(this).val().length == 0)) {
        //    $('<div class="calendar-event"><p>' + $(this).val() + '</p><a href="javascript:void(0);" class="remove-calendar-event"><i class="fa fa-remove"></i></a></div>').insertBefore(".add-event");
        //    $(this).val('');
        //} else {
        //    alert('Please enter event name');
        //}
        drag();
        removeEvent();
    });

    drag();
    removeEvent();
    
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var temp;
    var menues = [];
    var jsonData = {};
    $.ajax({
        type: "POST",
        url: "/Menus/getMenus",
        // The key needs to match your method's input parameter (case-sensitive).
        //data: JSON.stringify({ Markers: markers }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            temp = JSON.parse(data);
            var cnt=0;
            for (cnt = 0; cnt < temp.length; cnt++) {
                jsonData = {};
                jsonData["start"] = temp[cnt].start;
                jsonData["end"] = temp[cnt].end;
                jsonData["title"] = temp[cnt].title;
                menues.push(jsonData);
                debugger;
            }
            initCalendar();
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });

    //var events = {
    //        type: "POST",
    //        url: "/Menus/getMenus",
    //        // The key needs to match your method's input parameter (case-sensitive).
    //        //data: JSON.stringify({ Markers: markers }),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (data) {
    //            temp = JSON.parse(data);
    //            var cnt=0;
    //            for (cnt = 0; cnt < temp.length; cnt++) {
    //                jsonData = {};
    //                jsonData["start"] = temp[cnt].start;
    //                jsonData["end"] = temp[cnt].end;
    //                jsonData["title"] = temp[cnt].title;
    //                menues.push(jsonData);
    //                debugger;
    //            }
    //            initCalendar();
    //        },
    //        failure: function (errMsg) {
    //            alert(errMsg);
    //        }
    //}

    var start1, end1;
    function initCalendar() {
        $('#calendar').html('');
        $('#calendar').fullCalendar({

            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            selectable: true,
            select: function (start, end, jsEvent, view) {
                start1 = start;
                end1 = end;
                getDateMeals();
                $('#dateDetails').modal('show');
            },
            droppable: true, // this allows things to be dropped onto the calendar
            eventLimit: true, // allow "more" link when too many events
            events:
				menues
        });
    }

    function addMeal() {

        $.ajax({
            type: "POST",
            url: "/Menus/addMeal",
            // The key needs to match your method's input parameter (case-sensitive).
            //data: JSON.stringify({ Markers: markers }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ title: $("#txtArea").val(), start: start1, end: end1 }),
            success: function (data) {
                window.location = '/Menus';
            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });

    }

    function getDateMeals() {

        $.ajax({
            type: "POST",
            url: "/Menus/getDateMeals",
            // The key needs to match your method's input parameter (case-sensitive).
            //data: JSON.stringify({ Markers: markers }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ title: $("#txtArea").val(), start: start1, end: end1 }),
            success: function (data) {
                debugger;
                var parsed = JSON.parse(data);
                var i;
                $("#events").empty();
                for (i = 0; i < parsed.length; i++) {
                    $("#events").append('<div class="calendar-event"><p>' + parsed[i].Yemek + '</p><a href="javascript:void(0);" class="remove-calendar-event"><i class="fa fa-remove"></i></a></div>');

                }


            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });

    }
});