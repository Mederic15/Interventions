import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { VerifierCaracteresValidator } from '../shared/longueur-minumum/longueur-minimum.component';

import { ProblemeComponent } from './probleme.component';
import { TypeproblemeService } from './typeprobleme.service';

describe('ProblemeComponent', () => {
  let component: ProblemeComponent;
  let fixture: ComponentFixture<ProblemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [ ProblemeComponent ],
      providers:[TypeproblemeService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it("#1 | Zone PRÉNOM invalide avec 2 caractèress", () =>{
    let zone = component.problemeForm.controls['prenom'];
    zone.setValue("a".repeat(2));
    let errors = zone.errors || {};

    let validatorFn = VerifierCaracteresValidator.longueurMinimum(3);
    let result= validatorFn(zone as AbstractControl);
    expect(result['nbreCaracteresInsuffisant']).toBeTruthy();
    });

  it("#2 | Zone PRÉNOM valide avec 3 caractères", () =>{
    let zone = component.problemeForm.controls['prenom'];
    zone.setValue("a".repeat(3));
    expect(zone.valid).toBeTruthy();
  })
  
  it("#3 | Zone PRÉNOM valide avec 200 caractères", () =>{
    let zone = component.problemeForm.controls['prenom'];
    zone.setValue("a".repeat(200));
    expect(zone.valid).toBeTruthy();
  })

  it("#4 | Zone PRÉNOM invalide avec aucune valeur", () =>{
    let zone = component.problemeForm.controls['prenom'];
    zone.setValue("");
    let errors = zone.errors;
    expect(errors).toBeTruthy();
  })

  it("#5 | Zone PRÉNOM invalide avec 10 espaces", () =>{
    let control = { value: ' '.repeat(10) }
    let validatorFn = VerifierCaracteresValidator.longueurMinimum(3);
    let result= validatorFn(control as AbstractControl);
    expect(result['nbreCaracteresInsuffisant']).toBeTruthy();
})

  it("#6 | Zone PRÉNOM invalide avec 2 espaces et 1 caractère", () =>{
    let control = { value: 'a  ' }
      let validatorFn = VerifierCaracteresValidator.longueurMinimum(3);
      let result= validatorFn(control as AbstractControl);
      expect(result['nbreCaracteresInsuffisant']).toBeTruthy();
  })

  it("#15 | Zone TELEPHONE est désactivée quand ne pas me notifier", () =>{
    component.setNotification("NePasMeNotifier");

    let zone =component.problemeForm.get('telephone');
    expect(zone.disabled).toBeTrue();
  })

  it("#16 | Zone TELEPHONE est vide quand ne pas me notifier", () =>{
    component.setNotification("NePasMeNotifier");

    
    let zone = component.problemeForm.get('telephone');
    expect(zone.value).toBeNull();
  })

  it("#17 | Zone ADRESSE COURRIEL est désactivée quand ne pas me notifier", () =>{
    component.setNotification("NePasMeNotifier");

    let zone =component.problemeForm.get('courrielGroup.courriel');
    expect(zone.disabled).toBeTrue();
  })

  it("#18 | Zone CONFIRMER COURRIEL est désactivée quand ne pas me notifier", () =>{
    component.setNotification("NePasMeNotifier");

    let zone =component.problemeForm.get('courrielGroup.courrielConfirmation');
    expect(zone.disabled).toBeTrue();
  })

  it('#19 | Zone TELEPHONE est désactivée quand ne pas me notifier', () => {
    component.setNotification('pasnotification');
    let zone = component.problemeForm.get('telephone');
    expect(zone.status).toEqual('DISABLED'); 
  });

  it('#20 | Zone ADRESSE COURRIEL est activée quand notifier par courriel', () => {
    component.setNotification('courriel');
    let zone = component.problemeForm.get('courrielGroup.courriel');
    expect(zone.enabled).toBeTrue(); 
  });

  it('#21 | Zone CONFIRMER COURRIEL est activée quand notifier par courriel', () => {
    component.setNotification('courriel');
    let zone = component.problemeForm.get('courrielGroup.courrielConfirmation');
    expect(zone.enabled).toBeTrue(); 
  });

  it('#22 | Zone ADRESSE COURRIEL est invalide sans valeur quand notifier par courriel', () => {
    component.setNotification('courriel');
    let zone = component.problemeForm.get('courrielGroup.courriel');
    zone.setValue('')

    let errors = zone.errors;
    expect(errors).toBeTruthy(); 
  });

  it('#23 | Zone CONFIRMER COURRIEL est invalide sans valeur quand notifier par courriel', () => {
    component.setNotification('courriel');
    let zone = component.problemeForm.get('courrielGroup.courrielConfirmation');
    zone.setValue('')

    let errors = zone.errors;
    expect(errors).toBeTruthy(); 
  });

  it('#24 | Zone ADRESSE COURRIEL est invalide avec un format non conforme', () => {
    component.setNotification('courriel');
    let zone = component.problemeForm.get('courrielGroup.courriel');
    zone.setValue('allo')

    let errors = zone.errors;
    expect(errors).toBeTruthy(); 
  });

  it('#25 | Zone ADRESSE COURRIEL sans valeur et Zone CONFIRMER COURRIEL avec valeur valide retourne null', () => {
    component.setNotification('courriel');
    
    let courriel = component.problemeForm.get('courrielGroup.courriel');
    courriel.setValue('');
    let courrielConfirmation = component.problemeForm.get('courrielGroup.courrielConfirmation');
    courrielConfirmation.setValue('bonjour.1234@gmail.com');

    let validatorFn = emailMatcherValidator.courrielDifferents();
    let groupe = component.problemeForm.get('courrielGroup');
    let result = validatorFn(groupe as AbstractControl);
    expect(result).toBeNull(); 
  });

  it('#26 | Zone ADRESSE COURRIEL avec valeur valide et Zone CONFIRMER COURRIEL sans valeur retourne null', () => {
    component.setNotification('courriel');
    
    let courriel = component.problemeForm.get('courrielGroup.courriel');
    courriel.setValue('bonjour.1234@gmail.com');
    let courrielConfirmation = component.problemeForm.get('courrielGroup.courrielConfirmation');
    courrielConfirmation.setValue('');

    let validatorFn = emailMatcherValidator.courrielDifferents();
    let groupe = component.problemeForm.get('courrielGroup');
    let result = validatorFn(groupe as AbstractControl);
    expect(result).toBeNull(); 
  });

  it('#27 | Zones ADRESSE COURRIEL et CONFIRMER COURRIEL sont invalides si les valeurs sont différentes quand notifier par courriel', () => {
    component.setNotification('courriel');
    
    let courriel = component.problemeForm.get('courrielGroup.courriel');
    courriel.setValue('bonjour.1234@gmail.com');
    let courrielConfirmation = component.problemeForm.get('courrielGroup.courrielConfirmation');
    courrielConfirmation.setValue('allo.1234@gmail.com');

    let groupe = component.problemeForm.get('courrielGroup');
    let errors = groupe.errors
    expect(errors).toBeTruthy(); 
  });

  it('#28 | Zones ADRESSE COURRIEL et CONFIRMER COURRIEL sont valides si les valeurs sont identiques quand notifier par courriel', () => {
    component.setNotification('courriel');
    
    let courriel = component.problemeForm.get('courrielGroup.courriel');
    courriel.setValue('bonjour.1234@gmail.com');
    let courrielConfirmation = component.problemeForm.get('courrielGroup.courrielConfirmation');
    courrielConfirmation.setValue('bonjour.1234@gmail.com');

    let groupe = component.problemeForm.get('courrielGroup');
    expect(groupe.valid).toBeTruthy(); 
  });

});
