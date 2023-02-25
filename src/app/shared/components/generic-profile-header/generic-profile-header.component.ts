import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, UtilService } from 'src/app/core/services';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { CommonRoutes } from 'src/global.routes';
import { AnimationController } from '@ionic/angular';
import { DynamicFormComponent,JsonFormData } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-generic-profile-header',
  templateUrl: './generic-profile-header.component.html',
  styleUrls: ['./generic-profile-header.component.scss'],
})
export class GenericProfileHeaderComponent implements OnInit { 
  @ViewChild('form1') form1: DynamicFormComponent;
  @Input() headerData:any;
  @Input() buttonConfig:any;
  @Input() showRole:any;
  labels = ["CHECK_OUT_MENTOR","PROFILE_ON_MENTORED_EXPLORE_THE_SESSIONS"];
  showCredentials:boolean=false
  credentialType:any='id'
  idType:any='aadhaar'
  isAadhaarVerified:boolean=false
  isDigilockerVerified:boolean=false
  formData: JsonFormData = {
    controls: [
   {
    name: 'aadhaar',
    label: 'Enter the id',
    value: '',
    class: 'ion-margin',
    type: 'text',
    position: 'floating',
    errorMessage:'Enter a valid id',
    validators: {
      required: true,
      minLength: 12,
      maxLength: 12,
      pattern:'^[0-9]*$',
    },
  }
    ]
  };

  formControl:any={
    name:'aadhaar',
    label: 'Enter the id',
    value: '',
    class: 'ion-margin',
    type: 'text',
    position: 'floating',
    errorMessage:'Enter a valid id',
    validators: {
      required: true,
    },
  }

  skillsList:any=[
    { label: 'Degree',value: 'degree' },
    { label: 'B-Tech',value: 'btech' },
    { label: 'BSc',value: 'bsc' },
    { label: 'Mbbs',value: 'mbbs' },
  ]

  universityList:any=[
    { label: 'Bangalore University',value: 'bangaloreUniversity' },
    { label: 'Indian Institute of Science',value: 'iisc' },
    { label: 'Anna university',value: 'annaUniversity' },
    { label: 'University of Mysore',value: 'mysoreUniversity' },
  ]




  idControl:any = {
    name: 'id',
    label: 'Enter your id',
    value: '',
    class: 'ion-margin',
    type: 'text',
    position: 'floating',
    errorMessage:'Enter an id',
    validators: {
      required: true
    },
  }
  skillControl:any = [{
      name: 'skill',
      label: 'Select a skill',
      value: '',
      class: 'ion-margin',
      type: 'select',
      position: 'floating',
      errorMessage:'Select a skill',
      validators: {
        required: true
      },
      options: this.skillsList
    },
    {
      name: 'university',
      label: 'Select university',
      value: '',
      class: 'ion-margin',
      type: 'select',
      position: 'floating',
      errorMessage:'Select university',
      validators: {
        required: true
      },
      options: this.universityList
    },
    {
      name: 'rollNo',
      label: 'Roll no.',
      value: '',
      class: 'ion-margin',
      type: 'text',
      position: 'floating',
      errorMessage:'Enter your roll no.',
      validators: {
        required: true,
      },
    },
    {
      name: 'year',
      label: 'Year of passing',
      value: '',
      class: 'ion-margin',
      type: 'text',
      position: 'floating',
      errorMessage:'Enter a year',
      validators: {
        required: true,
        pattern:'^[0-9]*$',
        minLength:4,
        maxLength:4
      },
    }
]

  workControl:any = [
    {
      name: 'experience',
      label: 'Years of experience',
      value: '',
      class: 'ion-margin',
      type: 'text',
      position: 'floating',
      errorMessage:'Enter your experience',
      validators: {
        required: true,
      }
    },
    {
      name: 'companyName',
      label: 'Company name',
      value: '',
      class: 'ion-margin',
      type: 'text',
      position: 'floating',
      errorMessage:'Enter company name',
      validators: {
        required: true,
      }
    }
]

  genericControl:{
    name: 'Label',
    label: 'Enter the id',
    value: '',
    class: 'ion-margin',
    type: 'text',
    position: 'floating',
    errorMessage:'Enter a valid id',
    validators: {
      required: true,
    },
  }

  proofList:any=[
    {name:'Identity',value:'id'},{name:'Skill',value:'skill'},{name:'Work',value:'work'}
  ]
  idsList:any=[
    {name:'Aadhaar',value:'aadhaar'},{name:'Voter Id',value:'voter'},{name:'Driving License',value:'license'}
  ]



  constructor(private navCtrl:NavController, private profileService: ProfileService, private utilService:UtilService,private toast: ToastService, private translateService: TranslateService,
    private animationCtrl: AnimationController) { }

  ngOnInit() {
  }

  async action(event) {
    if(event==="edit"){
      this.navCtrl.navigateForward(CommonRoutes.EDIT_PROFILE);
    }else{
      this.translateText();
      let shareLink = await this.profileService.shareProfile(this.headerData._id);
      if (shareLink) {
        let url = `/${CommonRoutes.MENTOR_DETAILS}/${shareLink.shareLink}`;
        let link = await this.utilService.getDeepLink(url);
        this.headerData.name = this.headerData.name.trim();
        let params = { link: link, subject: this.headerData?.name, text: this.labels[0] + ` ${this.headerData.name}` + this.labels[1] }
        this.utilService.shareLink(params);
      } else {
        this.toast.showToast("No link generated!!!", "danger");
      }
    }
    //add output event and catch from parent; TODO
  }

  translateText() {
    this.translateService.get(this.labels).subscribe(translatedLabel => {
      let labelKeys = Object.keys(translatedLabel);
      labelKeys.forEach((key) => {
        let index = this.labels.findIndex(
          (label) => label === key
        )
        this.labels[index] = translatedLabel[key];
      })
    })
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  onSelect(event){
    this.formData.controls=[]
    console.log("VALUE: ",event.target.value)
    switch(event.target.value){
      case 'id':
        // let validator=
        // form['name']='aadhaar',
        // form['label']='Aadhaar Id'
        // form['validators']={minLength: 12, maxLength: 12, pattern:'^[0-9]*$'}
        this.idType=''
        this.formData.controls.push(this.genericControl)
                
      break;
      case 'skill':
        // form['name']='skills',
        // form['label']='Select skills'
        // this.formData.controls.push(this.formPrefiller('skills','Select skills',null,this.skillsList,'select'))
        // this.formData.controls.push(this.formPrefiller('university','Select university',null,this.universityList,'select'))
        this.formData.controls=this.skillControl
      break;
      case 'work':
        // form['name']='work',
        // form['label']='Enter Work Id'
        // this.formData.controls.push(this.formPrefiller('work','Enter work id'))
        this.formData.controls = this.workControl
      break;
    }
    this.credentialType=event.target.value
  }

  submit(type){
    this.form1.onSubmit();
    console.log('FORM VALUE: ',this.form1.myForm.value)
    this.close()
  }

  onIdSelect(event){
    this.formData.controls=[]
    let validator:any={required:true}
    switch(event.target.value){
      case 'aadhaar':
        validator={required:true, minLength: 12, maxLength: 12, pattern:'^[0-9]*$'}
        this.formData.controls.push(this.formPrefiller('aadhaar','Enter id',validator))
      break;
      case 'voter':
        this.formData.controls.push(this.formPrefiller('voter','Enter id',validator))
      break;
      case 'license':
        this.formData.controls.push(this.formPrefiller('license','Enter id',validator))
      break;
    }
    this.idType=event.target.value
    console.log('ID VAL:',event.target.value)

  }

  selectFile() {
    console.log('TRIGGER CLICKED')
    let element = document.getElementById('upload') as HTMLInputElement;
    element.click();
  }

  uploadFile(event){
    console.log('UPLOAD FILE',event.target.files[0])
  }

  close(){
    this.showCredentials=false
    this.credentialType='id'
    this.idType=''
    this.formData.controls=[]
  }


  formPrefiller(name,label,validator?,options?,type?){
    let form = this.formControl
    form['name'] = name,
    form['label'] = label
    if(validator){
      form['validators'] = validator
    }
    if(options){
      form['options'] = options
    }
    if(type){
      form['type'] = type
    }
    return form
  }

}