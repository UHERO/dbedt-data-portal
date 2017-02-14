import { DbedtPage } from './app.po';

describe('dbedt App', function() {
  let page: DbedtPage;

  beforeEach(() => {
    page = new DbedtPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
