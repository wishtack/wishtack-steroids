import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveComponentLoaderComponent } from './reactive-component-loader.component';

describe('ReactiveComponentLoaderComponent', () => {
  let component: ReactiveComponentLoaderComponent;
  let fixture: ComponentFixture<ReactiveComponentLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactiveComponentLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveComponentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
