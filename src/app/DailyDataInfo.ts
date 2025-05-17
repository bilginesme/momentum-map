 
export class DailyDataInfo {
   dateStamp: string;
   projectID: number;
   quantity:number;

   constructor() {
      this.dateStamp = '';
      this.projectID = 0;
      this.quantity = 0;
   }

   static fromJSON(json: any): DailyDataInfo {
      const data = new DailyDataInfo();
      data.dateStamp = json.dateStamp;
      data.projectID = json.projectID;
      data.quantity = json.quantity;
      return data;
    }
}