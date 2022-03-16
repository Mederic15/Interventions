import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      courrielGroup: this.fb.group({
        courriel: [{value: '', disabled: true}],
        courrielConfirmation: [{value: '', disabled: true}],
      }),
      telephone: [{value: '', disabled: true}],      
    })

    this.typeproblemeService.obtenirTypesProbleme()
        .subscribe(typesProbleme => this.typesProbleme = typesProbleme,
                   error => this.errorMessage = <any>error);  

    
  }

  appliquerNotifications(typeNotification: string): void {
    const courrielNottificationsControl = this.problemeForm.get('courrielGroup.courriel');
    const telephoneNotificationsControl = this.problemeForm.get('telephone');

    courrielNottificationsControl.clearValidators();
    courrielNottificationsControl.reset();
    courrielNottificationsControl.disable();

    telephoneNotificationsControl.clearValidators();
    telephoneNotificationsControl.reset();
    telephoneNotificationsControl.disable();

    if (typeNotification === 'courriel') {
      courrielNottificationsControl.setValidators([Validators.required]);
      courrielNottificationsControl.enable();
    }else if (typeNotification === 'telephone') {
      telephoneNotificationsControl.setValidators([Validators.required]);
      telephoneNotificationsControl.enable();
    }
    courrielNottificationsControl.updateValueAndValidity();
    telephoneNotificationsControl.updateValueAndValidity();
  }

  save(): void {
  }

}
