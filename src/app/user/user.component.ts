import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  inputs:["userInfo"],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
