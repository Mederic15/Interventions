import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { VerifierCaracteresValidator } from '../shared/longueur-minumum/longueur-minimum.component';

import { ProblemeComponent } from './probleme.component';

describe('ProblemeComponent', () => {
  let component: ProblemeComponent;
  let fixture: ComponentFixture<ProblemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ProblemeComponent ]
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
    expect(errors['minlength']).toBeTruthy();
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

 
});
