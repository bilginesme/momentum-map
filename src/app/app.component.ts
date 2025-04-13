interface InstanceInfo {
  dateStamp: string;
  projectID: number;
  quantity: number;
}

import { Component, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements AfterViewInit {
  title = 'momentum-map';
  year = 2025; // Example year
  heatmapData: any[] = [];
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  showModal = false;
  public data: InstanceInfo[] = [];

  constructor(
    private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Default language
    this.translate.use('en'); // Set initial language

    const lang = localStorage.getItem('lang'); // returns 'en'
    console.log('Language from cookie:', lang);

    this.translate.setDefaultLang('en');

    //this.storageTest();
    //this.testPromise(2).then(result => console.log('Promise resut = ' + result));
    this.generateYearlyHeatmap(this.year, false);
  }

  ngAfterViewInit() {
    //this.createSyntheticData();

    const storedData = localStorage.getItem('data');
    console.log(storedData);
    const parsedData = storedData ? JSON.parse(storedData) : null;
    console.log(parsedData);
  }

  generateYearlyHeatmap(year: number, isRandom:boolean) {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
      const firstDay = new Date(year, month, 1).getDay(); // Get starting weekday (0=Sunday, 1=Monday, etc.)

      let monthData = [];
      //let week = Array.from({ length: 7 }, () => null); // ✅ Corrected array initialization
      let week: ({ day: number; value: number } | null)[] = Array.from({ length: 7 }, () => null);

      for (let day = 1; day <= daysInMonth; day++) {

        let weekday = new Date(year, month, day).getDay();
        let theValue = 0;

        if(isRandom) {
          theValue = Math.floor(Math.random() * 10); // Random value between 0 and 9
        } 

        weekday = (weekday === 0) ? 6 : weekday - 1; // ✅ Shift Sunday (0) to the end
        week[weekday] = { day, value: theValue }; // ✅ Random value assigned correctly
      
        if (weekday === 6 || day === daysInMonth) {
          monthData.push([...week]); // ✅ Save a copy

          week = Array.from({ length: 7 }, () => null); // ✅ Reset week correctly
        }
      }

      months.push({ month, data: monthData });
    }

    this.heatmapData = months;
  }

  getHeatmapColor(value: number): string {
    if (value > 8) return '#00429d'; // Darkest
    if (value > 6) return '#4771b2';
    if (value > 4) return '#73a2c6';
    if (value > 2) return '#a5d5d8';
    return '#d0ebeb'; // Lightest
  }

  onDayClick(month:any, day: any) {
    if (day) {
      console.log(`Clicked on  month: ${month.month} day: ${day.day} with value: ${day.value}`);
      alert(`You clicked on ${day.day}, Value: ${day.value}`);
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);

     // Set the cookie
     localStorage.setItem('lang', 'en');
     console.log('Language set to cookie:', lang);
  }

  private storageTest(): void {
    const userData = {
      name: 'Bilgin',
      streak: 45,
      preferences: { language: 'en', theme: 'dark' }
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));

    const storedData = localStorage.getItem('userData');
    const userData2 = storedData ? JSON.parse(storedData) : null;
    console.log(userData2?.name); // "Bilgin"
  }
  
  handleModalData(data: { name: string; email: string }) {
    console.log('Received from modal:', data);
  }
  
  testPromise(param1: number): Promise<number> {
    return new Promise((resolve) => {
        let k = 2;
        let m = 3;
        let result = k * m;

        resolve(result); // Resolving the computed value
    });
  }

  private createSyntheticData(): InstanceInfo[] {
    const data = [];
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 31);
    const projectIDs = [1, 2, 3, 4, 5, 6];

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStamp = d.toISOString().split('T')[0]; // YYYY-MM-DD format
      const projectID = projectIDs[Math.floor(Math.random() * projectIDs.length)];
      const quantity = Math.floor(Math.random() * 100); // Random quantity as string

      data.push({ dateStamp, projectID, quantity });
    }

    let x:InstanceInfo = data.find(q => q.dateStamp == '2024-01-11')!;

    if(x) {
      x.quantity++;
    } else {
    }

    localStorage.setItem('data', JSON.stringify(data));
    
    const storedData = localStorage.getItem('data');
    console.log(storedData);
    const parsedData = storedData ? JSON.parse(storedData) : null;
    console.log(parsedData);

    return data;
  }
}
