import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussFormComponent } from './discuss-form.component';

describe('DiscussFormComponent', () => {
  let component: DiscussFormComponent;
  let fixture: ComponentFixture<DiscussFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscussFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscussFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
