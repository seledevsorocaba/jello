import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';

const mockBoard = {
  users: [
    { id: 'u1', name: 'User 1', avatarUrl: 'https://example.com/u1.png' },
    { id: 'u2', name: 'User 2', avatarUrl: 'https://example.com/u2.png' },
  ],
  labels: [
    { id: 'l1', name: 'Marketing', color: '#ff9f1a' },
    { id: 'l2', name: 'Legal', color: '#61bd4f' },
  ],
  board: {
    id: 'b1',
    title: 'Project Management',
    workspace: 'Inktistic ENT',
    visibility: 'Workspace visible',
    members: ['u1', 'u2'],
    lists: [
      {
        id: 'list1',
        title: 'Upcoming',
        cards: [
          {
            id: 'c1',
            title: 'Plan marketing campaign',
            labelIds: ['l1'],
            hasDescription: true,
            memberIds: ['u1', 'u2'],
          },
        ],
      },
    ],
  },
};

describe('App', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should render the board title and list names from the mock data', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpTesting.expectOne('/assets/data/fakedb.json');
    req.flush(mockBoard);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Project Management');
    expect(compiled.textContent).toContain('Upcoming');
  });
});
