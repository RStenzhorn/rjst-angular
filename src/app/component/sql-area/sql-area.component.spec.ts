import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlAreaComponent } from './sql-area.component';

describe('SqlAreaComponent', () => {
  let component: SqlAreaComponent;
  let fixture: ComponentFixture<SqlAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqlAreaComponent]
    });
    fixture = TestBed.createComponent(SqlAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
