import React from 'react';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { theme } from "../theme"

interface CalendarViewProps extends Pick<CalendarProps, 'onDayPress' | 'markedDates'> {
}

/**
 * Themed calendar wrapper used to select due-date filters and mark days that
 * contain tasks.
 */
const CalendarView: React.FC<CalendarViewProps> = ({ onDayPress, markedDates }) => {
  return (
    <Calendar
      onDayPress={onDayPress} 
      markedDates={markedDates} 
      theme={{
        backgroundColor: theme.colors.background,
        calendarBackground: theme.colors.inputBackground,
        textSectionTitleColor: theme.colors.text,
        textSectionTitleDisabledColor: theme.colors.completedText,
        selectedDayBackgroundColor: theme.colors.primary,
        selectedDayTextColor: theme.colors.text,
        todayTextColor: theme.colors.secondary,
        dayTextColor: theme.colors.text,
        textDisabledColor: theme.colors.completedText,
        dotColor: theme.colors.primary,
        selectedDotColor: theme.colors.text,
        arrowColor: theme.colors.text,
        disabledArrowColor: theme.colors.completedText,
        monthTextColor: theme.colors.text,
        indicatorColor: theme.colors.text,
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
    />
  );
};

export default CalendarView;
