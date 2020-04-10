;(function($) {
  $.extend($.fn, {
    CleverCalendar: function(options) {
      var defaults = {
        startDate: new Date(),
        classes: {
          calendar: "calendar",
          title: "caltitle",
          cell: "cell",
          today: "today",
          events: "events"
        },
        onCreated: function() {},
        onDateChanged: function(newDate) {},
        onSelectDay: function(newDate) { },
        onGetEvents: function(onDate) {
          return undefined;
        },
        onPrintNextMonth: function(onDate) { return ">"; },        
        onPrintPriorMonth: function(onDate) { return "<"; },
        onPrintNextYear: function(onDate) { return ">>"; },        
        onPrintPriorYear: function(onDate) { return "<<"; },
        dayNames: new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
        monthNames: new Array(
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        )
      };

      var CleverCalendar = this;
      CleverCalendar.settings = {};
      var todayDate = new Date().setHours(0, 0, 0, 0);
      var DisplayDate = new Date();

      var el = this;
      // `this` refers to the current Zepto collection.
      // When possible, return the Zepto collection to allow chaining.

      function init() {
        CleverCalendar.settings = $.extend({}, defaults, options);
        CleverCalendar.DisplayDate = CleverCalendar.settings.startDate;
        cal = ShowCalendar(CleverCalendar.settings.startDate);
        CleverCalendar.settings.onCreated();

        return el;
      }

      init();

      function ShowCalendar(inDate) {
        //  DECLARE AND INITIALIZE VARIABLES
        var Calendar = new Date(inDate);

        var year = Calendar.getFullYear(); // Returns year
        var month = Calendar.getMonth(); // Returns month (0-11)
        var today = Calendar.getDate(); // Returns day (1-31)
        var weekday = Calendar.getDay(); // Returns day ow week (sunday = 0)

        var DAYS_OF_WEEK = 7; // "constant" for number of days in a week
        var DAYS_OF_MONTH = new Date(year, month+1, 0).getDate(); // "constant" for number of days in a month
        var cal; // Used for printing

        Calendar.setDate(1); // Start the calendar day at '1'
        Calendar.setMonth(month); // Start the calendar month at now

        var TR_start = "<tr>";
        var TR_end = "</tr>";
        var highlight_start =
          "<td class='" +
          CleverCalendar.settings.classes.cell +
          " " +
          CleverCalendar.settings.classes.today +
          "''><b><span>";
        var highlight_end = "</span></b></TD>";
        var TD_start =
          "<td class='" + CleverCalendar.settings.classes.cell + "'>";
        var TD_end = "</td>";

        cal = "";
        cal +=
          "<table class='" +
          CleverCalendar.settings.classes.calendar +
          "'>";
        cal += "<tr class="+CleverCalendar.settings.classes.title+">";
        cal +=
          '<td colspan="' +
          DAYS_OF_WEEK +
          '" class="' +
          CleverCalendar.settings.classes.caltitle +
          '"><b>';
        cal +=
          "<span class='calleft priorMonth'>" + CleverCalendar.settings.onPrintPriorMonth(Calendar) +"</span>";
        cal += "<span class='calleft priorYear' style='padding-left:10px'>" + CleverCalendar.settings.onPrintPriorYear(Calendar) +"</span>";
        cal +=
          "<span class='calright nextMonth'>" + CleverCalendar.settings.onPrintNextMonth(Calendar) +"</span>";
        cal += "<span class='calright nextYear' style='padding-right:10px'>" + CleverCalendar.settings.onPrintNextYear(Calendar) +"</span>";
        cal +=
          CleverCalendar.settings.monthNames[month] +
          " " +
          year +
          "</b>" +
          TD_end +
          TR_end;
        cal += TR_start;

        // LOOPS FOR EACH DAY OF WEEK
        for (index = 0; index < DAYS_OF_WEEK; index++) {
            cal += TD_start + CleverCalendar.settings.dayNames[index] + TD_end;
        }

        cal += TD_end + TR_end;
        cal += TR_start;

        // FILL IN BLANK GAPS UNTIL TODAY'S DAY
        for (index = 0; index < Calendar.getDay(); index++) {
          cal += TD_start + "  " + TD_end;
        }

        // LOOPS FOR EACH DAY IN CALENDAR
        for (index = 0; index < DAYS_OF_MONTH; index++) {
          if (Calendar.getDate() > index) {
            // RETURNS THE NEXT DAY TO PRINT
            week_day = Calendar.getDay();

            // START NEW ROW FOR FIRST DAY OF WEEK
            if (week_day == 0) {
              cal += TR_start;
            }

            if (week_day != DAYS_OF_WEEK) {              // HIGHLIGHT TODAY'S DATE
              dispDate = new Date(year, month, index + 1).setHours(0, 0, 0, 0);
              events = CleverCalendar.settings.onGetEvents(new Date(dispDate));
              m = month+1;
              if (m  < 10) { m = "0" + m; }
              daySelect = year+"-"+m+"-"+(index + 1);

              clss = CleverCalendar.settings.classes.cell;
              if (dispDate == todayDate) {
                clss += " " + CleverCalendar.settings.classes.today;
              }
              if (events != undefined) {
                clss += " " + CleverCalendar.settings.classes.events;
              }
              cal += "<td data-day='"+daySelect+"' class='" + clss + "'>" + Calendar.getDate();
              cal += TD_end;
            }

            // END ROW FOR LAST DAY OF WEEK
            if (week_day == DAYS_OF_WEEK) cal += TR_end;
          }

          // INCREMENTS UNTIL END OF THE MONTH
          Calendar.setDate(Calendar.getDate() + 1);
        } // end for loop

        Calendar.setDate(Calendar.getDate() - 1);
        var dow = Calendar.getDay();
        var daysLeft = (6-dow);
        for (index = 0; index < daysLeft; index++) {
          cal += TD_start + "  " + TD_end; 
        }

        cal += "</TD></TR>";
        cal += "<tr><td colspan='7' class='title'><span class='gtToday'>Today</span></td></tr>";
        cal += "</TABLE>";

        el.html(cal);
        $(".priorMonth").on("click", function() {
          priorMonth();
        });
        $(".priorYear").on("click", function() {
          priorYear();
        });
        $(".nextMonth").on("click", function() {
          nextMonth();
        });
        $(".nextYear").on("click", function() {
          nextYear();
        });
        $(".gtToday").on("click", function() {
          gotoToday();
        });
        $(".cell").on("click", function(event) {
          target = event.target;
          day = $(target).data("day");
          var inDate = new Date(day);
          CleverCalendar.settings.onSelectDay(inDate);
        });
      }

      function addMonths(date, months) {
        var inDate = new Date(date);
        var d = inDate.getDate();
        inDate.setMonth(inDate.getMonth() +months);
        if (inDate.getDate() != d) {
          inDate.setDate(0);
        }
        CleverCalendar.settings.onDateChanged(inDate);
        return inDate.setHours(0, 0, 0, 0);
      }

      priorMonth = function() {
        CleverCalendar.DisplayDate = addMonths(CleverCalendar.DisplayDate, -1);
        cal = ShowCalendar(CleverCalendar.DisplayDate);
      };
      priorYear = function() {
        CleverCalendar.DisplayDate = addMonths(CleverCalendar.DisplayDate, -12);
        cal = ShowCalendar(CleverCalendar.DisplayDate);
      };
      nextMonth = function() {
        CleverCalendar.DisplayDate = addMonths(CleverCalendar.DisplayDate, 1);
        cal = ShowCalendar(CleverCalendar.DisplayDate);
      };
      nextYear = function() {
        CleverCalendar.DisplayDate = addMonths(CleverCalendar.DisplayDate, 12);
        cal = ShowCalendar(CleverCalendar.DisplayDate);
      };
      gotoToday = function() {
        CleverCalendar.DisplayDate = todayDate;
        cal = ShowCalendar(CleverCalendar.DisplayDate);
      };
    }
  });
})(window.Zepto || window.jQuery);
