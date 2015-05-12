class UserService {
    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    get() {
        return this.$http.get('/api/me');
    }
}
