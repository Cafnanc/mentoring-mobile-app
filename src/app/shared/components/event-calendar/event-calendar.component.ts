import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.css']
})
export class EventCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  viewDate: Date = new Date(); // The initial view date
  events: CalendarEvent[] = [  // Define your events here
    {
      start: new Date(),        // Start date and time of the event
      title: 'Sample Event',     // Event title
    },
  ];

  handleEventClicked(event: CalendarEvent): void {
    // Handle event click here
    console.log('Event clicked:', event);
  }

}
