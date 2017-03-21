export { ApiService } from '../app/api.service';
import { Observable } from 'rxjs/Observable';

export class MockApiService {
    fetchCategories() {
        return Observable.of(
            [{
                'children': {
                    'id': 8,
                    'name': 'Test Subcategory',
                    'parentId': 4
                },
                'id': 4,
                'name': 'Test Category'
            }]
        );
    }

    fetchSeries(id: number) {
        return Observable.of(
            [{
                'id': 140000,
                'name': 'T@ES.T',
                'title': 'Test Series Title',
                'frequency': 'year',
                'unitsLabel': '',
                'unitsLabelShort': '%'
            }]
        );
    }

    fetchSeriesDetail(id: number) {
        return Observable.of(
            [{
                'id': 146634,
                'name': 'T_EST@HAW.Q',
                'title': 'Test Series Title',
                'frequency': 'quarter',
                'frequencyShort': 'Q',
                'unitsLabel': '',
                'unitsLabelShort': 'Thous'
            }]
        );
    }

    fetchObservations(id: number) {
        return Observable.of(
            [{
                'chart data': {
                    'level': [283996800000, 1160.325],
                    'perc': [283996800000, 65784.6844]
                },
                'table data': {
                    'date': '1979-01-01',
                    'level': 1160.325,
                    'perc': 65784.6844
                }
            }]
        );
    }
}
