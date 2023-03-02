<template>
  <main>
      <FullCalendar :options="calendarOptions" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'

const result = []
const props = defineProps({
  data: {
    type: Object,
    require: true
  },
})

async function convertSchedule(schedule) {

  for (const course of schedule) {
    for (const meeting of course.meetings) {
      const startDateTime = new Date(meeting.startTime);
      const easternStartTime = startDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });

      const duration = meeting.duration.slice(2).toLowerCase();
      const durationParts = duration.split(/h|m/).map(part => parseInt(part));

      const easternEndTimeDateTime = new Date(startDateTime.getTime() + (durationParts[0] * 60 + durationParts[1]) * 60 * 1000);
      const easternEndTime = easternEndTimeDateTime.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });

      const daysOfWeek = meeting.daysOfWeek.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
      const id = `${course.subject}${course.number}`;

      result.push({
        startTime: easternStartTime,
        endTime: easternEndTime,
        title: course.subject+" "+course.number,
        id: id,
        daysOfWeek: daysOfWeek
      });
    }
  }

  return result;
}

onBeforeMount(() => {
  convertSchedule(props.data)
})

const calendarOptions = ref({
  plugins: [timeGridPlugin],
  initialView: 'timeGridWeek',
  weekends: false,
  height: "160vh",
  aspectRatio: 10,
  events: result,
  eventClick: function(info) {
    // alert(info)
  }
})
</script>

<style scoped>
  main {
    padding-top: 3rem;
    padding-bottom: 4rem;
    width: 72.5vw;
    display: inline-block;
  }
</style>
