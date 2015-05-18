class BoardService {
    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    list() {
        return this.$http.get('/api/board');
    }

    get(id) {
        return this.$http.get('/api/board/:id', {
            params: {
                id: id
            }
        });
    }
}