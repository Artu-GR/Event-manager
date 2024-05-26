import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }

  eventId: string = this.route.snapshot.params['id'];

}
