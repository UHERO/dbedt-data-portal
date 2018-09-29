export { ApiService } from '../app/api.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

export class MockApiService {
  fetchCategories() {
    return of(
      [
        {
          children: [{
            id: 8,
            name: 'Test Subcategory',
            parentId: 4
          }],
          id: 4,
          name: 'Test Category'
        }, {
          children: [{
            id: 10,
            name: 'Test Subcategory',
            parentId: 6
          }],
          id: 6,
          name: 'Test Category'
        }
      ]
    );
  }
}
