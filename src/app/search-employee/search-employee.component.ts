import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ModalController } from '@ionic/angular';
import { FormatCurrencyService } from '../utils/format-currency.service';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.scss'],
})
export class SearchEmployeeComponent implements OnInit {
  db:any;
  form: FormGroup;
  employeeList:any=[];
  sal:any;
  defaultDate:any;
  submitted:boolean = false;
  isValid :boolean = true;
  searchResults:any =[];
  searchDataWithFilterName:any={"filterBy":"","empData":[]};
  departmentList =[
    {name:'Sales'},
    {name:'HR'},
    {name:'Finance'},
    {name:'Mobility and Cloud'},
    {name:'Admin'},
    {name:'Marketing'}];

  positions = [
    {title:'Developer'},
    {title:'Project Manager'},
    {title:'Marketing Manager'},
    {title:'HR Manager'},
    {title:'Administrative Assistant'},
    {title:'Finance Manager'}];
  constructor(private sqlite:SQLite,    
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    public  fc:FormatCurrencyService) {
    this.form = this.formBuilder.group({
      name: [null,[Validators.required]],
      dob: [null],
      nrc: [null],
      department: [null,[Validators.required]],
      position: [null,[Validators.required]],
      salary: [this.sal],
    });
   }
  
  get errorControl(){
   return this.form.controls;
  }

  ngOnInit() {
    this.sqlite.create({
      name: "employeeDB",
      location: "default"
    }).then((db:SQLiteObject) => {
      this.db = db;
      let query = "select * from employeedata";
      this.db.executeSql(query, []).then((data:any) => {
        if (data.rows.length > 0) {
          for (let j = 0; j < data.rows.length; j++) {
            this.employeeList.push(data.rows.item(j));
          }
         console.log("employee list in search page>"+JSON.stringify(this.employeeList))

        }

    }, (error:any) => {
      
    })
  });
  }
  filterEmployee(){
    this.submitted = true;
    if (this.form.get('name').valid) {
            this.isValid = true;
          }

          else {
            this.isValid = false;
            return;
          }
    if(this.form.get('name').valid && this.form.get('department').valid && this.form.get('position').valid){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.name.toLowerCase().indexOf((this.form.get('name')).value.toLowerCase()) > -1 &&
                emp.department.toLowerCase().indexOf((this.form.get('department')).value.toLowerCase()) > -1 &&
                emp.position.toLowerCase().indexOf((this.form.get('position')).value.toLowerCase()) > -1);
      });
    }
    else if(this.form.get('name').valid && this.form.get('department').valid ){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.name.toLowerCase().indexOf((this.form.get('name')).value.toLowerCase()) > -1 &&
                emp.department.toLowerCase().indexOf((this.form.get('department')).value.toLowerCase()) > -1 );               
      });
    }
    else if(this.form.get('name').valid && this.form.get('position').valid ){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.name.toLowerCase().indexOf((this.form.get('name')).value.toLowerCase()) > -1 &&
                emp.position.toLowerCase().indexOf((this.form.get('position')).value.toLowerCase()) > -1 );               
      });
    }
    
    else if(this.form.get('department').valid && this.form.get('position').valid ){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.department.toLowerCase().indexOf((this.form.get('department')).value.toLowerCase()) > -1 &&
                emp.position.toLowerCase().indexOf((this.form.get('position')).value.toLowerCase()) > -1 );               
      });
    }

    else if(this.form.get('name').valid){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.name.toLowerCase().indexOf((this.form.get('name')).value.toLowerCase()) > -1);               
      });
    }
    
    else if(this.form.get('department').valid){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.department.toLowerCase().indexOf((this.form.get('department')).value.toLowerCase()) > -1);               
      });
    }

    else if(this.form.get('position').valid){
      this.searchResults = this.employeeList.filter((emp:any) => {
        return (emp.position.toLowerCase().indexOf((this.form.get('position')).value.toLowerCase()) > -1);               
      });
    }
    console.log("search results >>>"+JSON.stringify(this.searchResults));
    this.searchDataWithFilterName.filterBy = this.form.get('name').value;
    this.searchDataWithFilterName.empData = this.searchResults;
    this.modalCtrl.dismiss(this.searchDataWithFilterName);

   }
   getDate(dt:any) {
    console.log("value>>"+dt.target.value);
    // let date = new Date(dt.target.value).toISOString().substring(0, 10);
    let date = dt.target.value;
    this.defaultDate = date.substring(8,10) + "/" + date.substring(5, 7) + "/" + date.substring(0,4);;
    this.form.get('dob').setValue(this.defaultDate , {
       onlyself: true
    });
    console.log("dob >"+this.form.get('dob').value)
 }
   
  onReset() {
    this.submitted = false;
    this.form.reset();
    this.searchDataWithFilterName.filterBy = this.form.get('name').value;
    this.searchDataWithFilterName.empData = this.employeeList;
    this.modalCtrl.dismiss(this.searchDataWithFilterName);
  }

  formatSalary(valString:any) {
   return this.fc.formatSalary(valString);
  };
}
