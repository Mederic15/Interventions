import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { VerifierCaracteresValidator } from '../shared/longueur-minumum/longueur-minimum.component';
import { IProbleme } from './probleme';
import { ITypeProbleme } from './typeProbleme';
import { TypeproblemeService } from './typeprobleme.service';
import { Router } from '@angular/router';
import { ProblemeService } from './probleme.service';

@Component({
  selector: 'Inter-probleme',
  templateUrl: './probleme.component.html',
  styleUrls: ['./probleme.component.css']
})
export class ProblemeComponent implements OnInit {
  problemeForm: FormGroup;
  typesProbleme: ITypeProbleme[];
  errorMessage: string;

  probleme: IProbleme;

  constructor(private fb: FormBuilder, private typeproblemeService: TypeproblemeService, private problemeService: ProblemeService, private route: Router) { }

  ngOnInit(): void {
    this.problemeForm = this.fb.group({
      prenom: ['' , [VerifierCaracteresValidator.longueurMinimum(3), Validators.required]], 
      nom: ['' , [VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
      //typeprobleme: ['', [Validators.required]] ,
      typeprobleme: [''],
      notification: ['pasnotification'],
      courrielGroup: this.fb.group({
        courriel: [{value: '', disabled: true}],
        courrielConfirmation: [{value: '', disabled: true}],
      }//, {Validator: emailMatcher}
      ),
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
    if (this.problemeForm.dirty && this.problemeForm.valid) {
        // Copy the form values over the problem object values
        this.probleme = this.problemeForm.value;
        this.probleme.id = 0;
        this.probleme.courriel = this.problemeForm.get('courrielGroup.courriel').value;
        //this.probleme.dateProbleme = new Date();
        this.problemeService.saveProbleme(this.probleme)
            .subscribe( // on s'abonne car on a un retour du serveur à un moment donné avec la callback fonction
                () => this.onSaveComplete(),  // Fonction callback
                (error: any) => this.errorMessage = <any>error
            );
    } else if (!this.problemeForm.dirty) {
        this.onSaveComplete();
    }
  }

  onSaveComplete(): void { 
    // Reset the form to clear the flags
    this.problemeForm.reset();  // Pour remettre Dirty à false.  Autrement le Route Guard va dire que le formulaire n'est pas sauvegardé
    this.route.navigate(['/accueil']);
  }

}
function subscibe(arg0: (value: any) => void) {
  throw new Error('Function not implemented.');
}

