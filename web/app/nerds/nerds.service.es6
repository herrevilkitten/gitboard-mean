class NerdsService {
    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    get() {
        return this.$http.get('/api/nerds');
    }

    create(nerdData) {
        return this.$http.post('/api/nerds', nerdData);
    }

    remove(id) {
        return this.$http.delete('/api/nerds/' + id);
    }
}
