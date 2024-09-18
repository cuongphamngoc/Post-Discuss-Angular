import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussDetailComponent } from './discuss-detail.component';

describe('DiscussDetailComponent', () => {
  let component: DiscussDetailComponent;
  let fixture: ComponentFixture<DiscussDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscussDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscussDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
