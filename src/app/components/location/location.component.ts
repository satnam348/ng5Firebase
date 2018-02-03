import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
export interface Settings {
  geoPredictionServerUrl?: string;
  geoLatLangServiceUrl?: string;
  geoLocDetailServerUrl?: string;
  geoCountryRestriction?: any;
  geoTypes?: any;
  geoLocation?: any;
  geoRadius?: number;
  serverResponseListHierarchy?: any;
  serverResponseatLangHierarchy?: any;
  serverResponseDetailHierarchy?: any;
  resOnSearchButtonClickOnly?: boolean;
  useGoogleGeoApi?: boolean;
  inputPlaceholderText?: string;
  inputString?: string;
  showSearchButton?: boolean;
  showRecentSearch?: boolean;
  showCurrentLocation?: boolean;
  recentStorageName?: string;
  noOfRecentSearchSave?: number;
  currentLocIconUrl?: string;
  searchIconUrl?: string;
  locationIconUrl?: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent implements OnInit {
  userSettings: Settings;
  constructor(public _AuthService: AuthService) { }

  ngOnInit() {

    this.userSettings = {
      'showSearchButton': false,
      'showCurrentLocation': true,
      'currentLocIconUrl': 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
      'locationIconUrl': 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
      'recentStorageName': 'componentData4',
      'noOfRecentSearchSave': 8,
      'inputPlaceholderText': 'Location',
      'showRecentSearch': false ,
    };
     this.userSettings = Object.assign({}, this.userSettings) ;  // Very Important Line to add after modifying settings.
  }
  autoCompleteCallback1(selectedData: any) {
    this._AuthService.locationNotifier.next(selectedData.data);
   console.log(selectedData);
}
}
