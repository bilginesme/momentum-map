interface InstanceInfo {
  dateStamp: string;
  projectID: number;
  quantity: number;
}

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalDataComponent } from './modal-data/modal-data.component';
import { DailyDataInfo } from './DailyDataInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements AfterViewInit {
  @ViewChild(ModalDataComponent) public modalData!: ModalDataComponent; 
  title = 'momentum-map';
  year = 2025; // Example year
  heatmapData: any[] = [];
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  showModal = false;
  public data: InstanceInfo[] = [];
  public selectedDay: any = '';
  public selectedMonth: any = '';
  public selectedQuantity:number = 0;
  public parsedData:any = null;

  languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];
  
  selectedLanguage = 'en'; // default

  constructor(
    private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Default language
    this.translate.use('en'); // Set initial language

    const lang = localStorage.getItem('lang'); // returns 'en'

    this.translate.setDefaultLang('en');

    //this.storageTest();
    //this.testPromise(2).then(result => console.log('Promise resut = ' + result));
    this.generateYearlyHeatmap(this.year, false);
  }

  ngAfterViewInit() {
    //this.createSyntheticData();

    const storedData = localStorage.getItem('data');
    const parsedData = storedData ? JSON.parse(storedData) : null;

    console.table(parsedData);

    this.updateDailyData(3, 21);

    console.table(this.languages);
  }

  generateYearlyHeatmap(year: number, isRandom:boolean) {
    const months = [];
    const storedData = localStorage.getItem('data');
    
    this.parsedData = storedData ? JSON.parse(storedData) : null;

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
      const firstDay = new Date(year, month, 1).getDay(); // Get starting weekday (0=Sunday, 1=Monday, etc.)

      let monthData = [];
      let week: ({ day: number; value: number } | null)[] = Array.from({ length: 7 }, () => null);

      for (let day = 1; day <= daysInMonth; day++) {
        let weekday = new Date(year, month, day).getDay();
        let theValue = 0;

        if(isRandom) {
          theValue = Math.floor(Math.random() * 10); // Random value between 0 and 9
        } 
        else {
          const dateStamp = new Date(year, month, day).toISOString().split('T')[0]; // YYYY-MM-DD format
          const dataEntry = this.parsedData.find((entry: InstanceInfo) => entry.dateStamp === dateStamp);
          
          if (dataEntry) {
            theValue = dataEntry.quantity; // Use the quantity from the data entry
          } else {
            theValue = 0; // Default value if no entry found
          }
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
 
  getHeatmapColor(
    value: number,
    theme: 'blue' | 'red' | 'yellow' = 'blue',
    maxValue: number = 100
  ): string {
    // Clamp and normalize value between 0 and maxValue
    const v = Math.max(0, Math.min(value, maxValue)) / maxValue;
  
    let startColor: [number, number, number];
    let endColor: [number, number, number];
  
    switch (theme) {
      case 'red':
        startColor = [255, 230, 230];
        endColor = [139, 0, 0];
        break;
      case 'yellow':
        startColor = [255, 255, 204];
        endColor = [204, 153, 0];
        break;
      case 'blue':
      default:
        startColor = [208, 235, 235];
        endColor = [0, 66, 157];
        break;
    }
  
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * v);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * v);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * v);
  
    const toHex = (x: number) => x.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  getRainbowColor(value: number, maxValue: number = 100): string {
  // Clamp and normalize
  const v = Math.max(0, Math.min(value, maxValue)) / maxValue;

  // Map value to hue (0° = red, 360° = red again, but we usually want around 0–270° for rainbow)
  const hue = (1 - v) * 270; // 0 = violet, 270 = red

  // Use full saturation and lightness
  return `hsl(${hue}, 100%, 50%)`;
  }

  getPastelRainbowColor(
    value: number,
    maxValue: number = 100
  ): string {
    // Clamp and normalize
    const v = Math.max(0, Math.min(value, maxValue)) / maxValue;
  
    // Map value to hue (0° = red, 270° = violet)
    const hue = (1 - v) * 270;
  
    // Pastel style: lower saturation, higher lightness
    return `hsl(${hue}, 70%, 70%)`;
  }
  
  onDayClick(month:any, day: any) {
    if (day) {
      let year = 2025;
      const dateStamp = new Date(year, month.month, day.day + 1).toISOString().split('T')[0]; // YYYY-MM-DD format
      const dataEntry = this.parsedData.find((entry: InstanceInfo) => entry.dateStamp === dateStamp);
      
      this.selectedDay = day.day;
      this.selectedMonth = month.month;
      this.selectedQuantity = dataEntry ? dataEntry.quantity : 0; // Use the quantity from the data entry
      this.showModal = true;

      this.modalData.updateForm();
      this.modalData.form.setValue({
        txtQuantity: this.selectedQuantity.toString(),
        txtNote: ''
      });
    }
  }

  getPastelSunriseColor(
    value: number,
    maxValue: number = 100
  ): string {
    // Clamp and normalize
    const v = Math.max(0, Math.min(value, maxValue)) / maxValue;
  
    // Define key pastel colors
    const stops: { pos: number, color: [number, number, number] }[] = [
      { pos: 0, color: [255, 255, 255] },   // White
      { pos: 0.2, color: [255, 249, 204] }, // Light Yellow
      { pos: 0.5, color: [255, 224, 179] }, // Light Orange
      { pos: 0.8, color: [255, 179, 167] }, // Light Red-Orange
      { pos: 1, color: [255, 128, 128] }    // Soft Red
    ];
  
    // Find the two stops surrounding the value
    let lower = stops[0];
    let upper = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (v >= stops[i].pos && v <= stops[i + 1].pos) {
        lower = stops[i];
        upper = stops[i + 1];
        break;
      }
    }
  
    // Calculate local interpolation factor between the two stops
    const range = upper.pos - lower.pos;
    const rangeV = (v - lower.pos) / (range || 1);
  
    // Interpolate colors
    const r = Math.round(lower.color[0] + (upper.color[0] - lower.color[0]) * rangeV);
    const g = Math.round(lower.color[1] + (upper.color[1] - lower.color[1]) * rangeV);
    const b = Math.round(lower.color[2] + (upper.color[2] - lower.color[2]) * rangeV);
  
    const toHex = (x: number) => x.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  switchLanguage(lang: string) {
    this.translate.use(lang);

     // Set the cookie
     localStorage.setItem('lang', 'en');
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
  }
  
  handleModalData(data: { quantity: string; note: string }) {
    console.log('Received from modal:', data);
    console.log();
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
    const startDate = new Date(2025, 2, 1);
    const endDate = new Date(2025, 2, 31);
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
    const parsedData = storedData ? JSON.parse(storedData) : null;

    return data;
  }

  private updateDailyData(month:number, day:number): void {
    const storedData = localStorage.getItem('data');
   
    let dailyDataArray: DailyDataInfo[] = [];

    if (storedData) {
      const parsedArray = JSON.parse(storedData);

      dailyDataArray = parsedArray.map((item: any) => {
        const data = new DailyDataInfo();
        data.dateStamp = item.dateStamp;
        data.projectID = item.projectID;
        data.quantity = item.quantity;
        return data;
      });
    }

    console.table(dailyDataArray);

  }

  private writeDataToLocalStorage(data: DailyDataInfo[]): void {
    localStorage.setItem('theData', JSON.stringify(data));
  }

  private readDataFromLocalStorage(): DailyDataInfo[] {
    
    const storedData = localStorage.getItem('yourKey');

let dailyDataArray: DailyDataInfo[] = [];

if (storedData) {
  const parsedArray = JSON.parse(storedData);
  dailyDataArray = parsedArray.map((item: any) => DailyDataInfo.fromJSON(item));
}

    //const storedData = localStorage.getItem('theData');
    //return storedData ? JSON.parse(storedData) : [];

    return dailyDataArray;
  }   
  private clearLocalStorage(): void { 
    localStorage.clear();
  }
  private removeItemFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  } 
  private getItemFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  onLanguageChange(event: any) {
    let newLang = event.target.value;
    console.log('Language changed to', newLang);
    // apply translation logic, update UI, etc.
  }
}
