import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { timingSafeEqual } from 'crypto';
import { AddEmployeePage } from '../add-employee/add-employee.page';
import { SearchEmployeeComponent } from '../search-employee/search-employee.component';
import { FormatCurrencyService } from '../utils/format-currency.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {
  db:any;
  employeeList: any=[];
  isNotFound:boolean = false;
  filterBy="";
  constructor(
    private sqlite: SQLite,
    public navCtrl:NavController,
    public modalCtrl:ModalController,
    public  fc:FormatCurrencyService
  ) {
    console.log("employee list page")
   
   }

  ngOnInit(){

}
ionViewWillEnter(){
  this.employeeList = [];
  this.filterBy="";
  this.sqlite.create({
    name: "employeeDB",
    location: "default"
  }).then((db:SQLiteObject) => {
    this.db = db;
    let query = "select * from employeedata";
    this.db.executeSql(query, []).then((data:any) => {
      if (data.rows.length > 0) {
        this.isNotFound = false;
        for (let j = 0; j < data.rows.length; j++) {
          this.employeeList.push(data.rows.item(j));
          this.employeeList[j].salary = this.fc.formatSalary(this.employeeList[j].salary);
        }
       console.log("employee list  >"+JSON.stringify(this.employeeList))

      }
      else{
         this.isNotFound = true;
      }

  }, (error:any) => {
    this.isNotFound = true;
    console.log("cannot select data");
  })
});
}



 gotoDetail(emp:any){
   this.navCtrl.navigateForward("add-employee",{state:{empData : emp}})
  }
  async goToSearchPage(){
  console.log("gotosearchpage")
    const modal =await this.modalCtrl.create({component:SearchEmployeeComponent});
    modal.present();
    modal.onWillDismiss().then((data:any) => {
        this.employeeList = data['data'].empData;
        this.filterBy = data['data'].filterBy;
        console.log("after dismiss >>"+JSON.stringify(this.employeeList));
          if(this.employeeList && this.employeeList.length <= 0){
            this.isNotFound = true;      
        }
         else{
          this.isNotFound = false;
          for(let i=0;i<this.employeeList.length;i++)
          {
            this.employeeList[i].salary = this.fc.formatSalary(this.employeeList[i].salary);
          }
         }
      
    })
}

goToAddPage(){
  this.navCtrl.navigateForward('add-employee');
}
}
