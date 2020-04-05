# Clever Calendar

Simple calendar component for Zepto or jQuery.

## Configurations

All configuration values and events are optional.

### Defaults

startDate: Date to start the calendar on (Default Today)

classes: Used as classes added to each element when displayed

    calendar: Applied to div wrapping the calendar
    
    title: Applied to calendar title line 
    
    cell: Applied on each cell
    
    today: Applied to cell for todays date
    
    events: Applied to cells where onGetEvents does not return undefined (eg days where events exist)

monthName: List of the month names (Default full English month names)

dayName: Listof day names starting with Sunday (Default English first 3 letters of Day Name)

### Events
    
onCreated: Called after calendar is created

onDateChanged: Called when monthe changes (prior or next month/year)

onSelectDay: When a day cell is clicked

onGetEvents: When calendar is displayed this is called for each day to check if events exist on the day

onDisplayNextMonth, onDisplayPriorMonth, onDisplayNextYear, onDisplayPriorYear: can be used to display alternate labels for Next/Prior Month/Year instead of the standard &lt; &gt; - for example icons from an icon library.
