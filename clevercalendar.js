(function($) {
  $.extend($.fn, {
    CleverCalendar: function(options) {
      var defaults = {
        startDate: new Date(),
        classes: {
          calendar: "calendar",
          title: "title",
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
        var weekday = Calendar.getDay(); // Returns day (1-31)

        var DAYS_OF_WEEK = 7; // "constant" for number of days in a week
        var DAYS_OF_MONTH = 31; // "constant" for number of days in a month
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
          "'>" +
          TR_start;
        cal +=
          '<td colspan="' +
          DAYS_OF_WEEK +
          '" class="' +
          CleverCalendar.settings.classes.title +
          '"><b>';
        cal +=
          "<span class='left priorMonth'>&lt;</span><span class='left priorYear' style='padding-left:10px'>&lt;&lt;</span>";
        cal +=
          "<span class='right nextMonth'>&gt;</span><span class='right nextYear' style='padding-right:10px'>&gt;&gt;</span>";
        cal +=
          CleverCalendar.settings.monthNames[month] +
          " " +
          year +
          "</b>" +
          TD_end +
          TR_end;
        cal += TR_start;

        //   DO NOT EDIT BELOW THIS POINT  //

        // LOOPS FOR EACH DAY OF WEEK
        for (index = 0; index < DAYS_OF_WEEK; index++) {
          // BOLD TODAY'S DAY OF WEEK
          if (weekday == index) {
            cal +=
              TD_start +
              "<b>" +
              CleverCalendar.settings.dayNames[index] +
              "</b>" +
              TD_end;
          }
          // PRINTS DAY
          else {
            cal += TD_start + CleverCalendar.settings.dayNames[index] + TD_end;
          }
        }

        cal += TD_end + TR_end;
        cal += TR_start;

        // FILL IN BLANK GAPS UNTIL TODAY'S DAY
        for (index = 0; index < Calendar.getDay(); index++)
          cal += TD_start + "  " + TD_end;

        // LOOPS FOR EACH DAY IN CALENDAR
        for (index = 0; index < DAYS_OF_MONTH; index++) {
          if (Calendar.getDate() > index) {
            // RETURNS THE NEXT DAY TO PRINT
            week_day = Calendar.getDay();

            // START NEW ROW FOR FIRST DAY OF WEEK
            if (week_day == 0) {
              cal += TR_start;
            }

            if (week_day != DAYS_OF_WEEK) {
              // SET VARIABLE INSIDE LOOP FOR INCREMENTING PURPOSES
              var day = Calendar.getDate();

              // HIGHLIGHT TODAY'S DATE
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
              cal += "<td data-day='"+daySelect+"' class='" + clss + "'>" + day;
              cal += TD_end;
            }

            // END ROW FOR LAST DAY OF WEEK
            if (week_day == DAYS_OF_WEEK) cal += TR_end;
          }

          // INCREMENTS UNTIL END OF THE MONTH
          Calendar.setDate(Calendar.getDate() + 1);
        } // end for loop

        cal += "</TD></TR></TABLE>";

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
        inDate.setMonth(inDate.getMonth() + +months);
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
    }
  });
})(Zepto);