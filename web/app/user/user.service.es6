class UserService {
    /*@ngInject*/
    constructor($http, $log, $q) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.currentUser = null;
    }

    get() {
        return this.$http.get('/api/me');
    }

    me() {
        var q = this.$q.defer();

        if (this.currentUser) {
            q.resolve({data: this.currentUser});
        }

        this
            .get()
            .then(response => {
                this.currentUser = response.data;
                q.resolve({data: this.currentUser});
            })
            .catch(function(error) {
                q.reject(error);
            });

        return q.promise;
    }
}
