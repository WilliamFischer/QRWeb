import { Component, OnInit, ViewChild } from '@angular/core';

// Maps
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";

@Component({
  selector: 'app-moreinfo',
  templateUrl: './moreinfo.component.html',
  styleUrls: ['./moreinfo.component.scss']
})
export class MoreinfoComponent implements OnInit {
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;

  moreDetailsObj : any = {
    phone : '',
    address : ''
  }

  constructor() { }

  ngOnInit(): void {
  }

  onChange(address: Address) {
    console.log(address);
    this.moreDetailsObj.address = address;
  }


}
