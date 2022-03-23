import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { VerifierCaracteresValidator } from '../shared/longueur-minumum/longueur-minimum.component';
import { ITypeProbleme } from './probleme';
import { TypeproblemeService } from './typeprobleme.service';

@Component({
  selector: 'Inter-probleme',
  templateUrl: './probleme.component.html',
  styleUrls: ['./probleme.component.css']
})
export class ProblemeComponent implements OnInit {
  problemeForm: FormGroup;
  typesProbleme: ITypeProbleme[];
  errorMessage: string;
  constructor(private fb: FormBuilder, private typeproblemeService: TypeproblemeService) { }

  ngOnInit(): void {
    this.problemeForm = this.fb.group({
      prenom: ['' , [VerifierCaracteresValidator.longueurMinimum(3), Validators.required]], 
      nom: ['' , [VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
      typeprobleme: ['', [Validators.required]] ,
      notification: ['pasnotification'],
      courrielGroup: this.fb.group({
        courriel: [{value: '', disabled: true}],
        courrielConfirmation: [{value: '', disabled: true}],
      }),
      telephone: [{value: '', disabled: true}], 
      descriptionProbleme: ['', [Validators.required, Validators.minLength(5)]],
      noUnite: '',
      dateProbleme: {value: Date(), disabled: true}     
    })

    this.typeproblemeService.obtenirTypesProbleme()
        .subscribe(typesProbleme => this.typesProbleme = typesProbleme,
                   error => this.errorMessage = <any>error);
                   
        this.problemeForm.get('notification').valueChanges
          .subscribe(value => this.setNotification(value));

    
  }

  setNotification(typeNotification: string): void {
    const courrielNottificationsControl = this.problemeForm.get('courrielGroup.courriel');
    const courrielConfirmationNottificationsControl = this.problemeForm.get('courrielGroup.courrielConfirmation');
    const telephoneNotificationsControl = this.problemeForm.get('telephone');
    const courrielGroupControl = this.problemeForm.get('courrielGroup');
    const courrielDifferents = emailMatcherValidator.courrielDifferents();

    courrielNottificationsControl.clearValidators();
    courrielNottificationsControl.reset();
    courrielNottificationsControl.disable();

    courrielConfirmationNottificationsControl.clearValidators();
    courrielConfirmationNottificationsControl.reset();
    courrielConfirmationNottificationsControl.disable();

    telephoneNotificationsControl.clearValidators();
    telephoneNotificationsControl.reset();
    telephoneNotificationsControl.disable();

    if (typeNotification === 'courriel') {
      courrielNottificationsControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      courrielConfirmationNottificationsControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      courrielNottificationsControl.enable();
      courrielConfirmationNottificationsControl.enable();
      courrielGroupControl.setValidators([Validators.compose([courrielDifferents])]);
    }else if (typeNotification === 'telephone') {
      telephoneNotificationsControl.setValidators([Validators.required, Validators.pattern('[0-9]{10}')]);
      telephoneNotificationsControl.enable();
    }
    courrielNottificationsControl.updateValueAndValidity();
    courrielConfirmationNottificationsControl.updateValueAndValidity();
    courrielGroupControl.updateValueAndValidity();
    telephoneNotificationsControl.updateValueAndValidity();
  }

  save(): void {
  }

}
function subscibe(arg0: (value: any) => void) {
  throw new Error('Function not implemented.');
}

