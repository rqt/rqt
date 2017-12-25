var http = require('http');
var enableDestroy = require('server-destroy');
var Catchment = require('catchment');

var createHandler = function createHandler() {
    var getEndData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
        return '200';
    };

    var params = {
        postPromise: null,
        called: 0
    };
    return {
        handler: function handler(req, res) {
            return new Promise(function ($return, $error) {
                var catchment, promise, data, _data;

                params.called += 1;
                params.json = req.headers['content-type'] === 'application/json';
                params.headers = req.headers;
                if (req.method === 'POST') {
                    catchment = new Catchment();
                    req.pipe(catchment);
                    promise = catchment.promise;

                    params.postPromise = promise;
                    if (params.json) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                    }
                    return Promise.resolve(promise).then(function ($await_2) {
                        try {
                            data = $await_2;
                            res.end(data);
                            return $If_1.call(this);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this), $error);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    _data = getEndData();
                    res.end(_data);
                    return $If_1.call(this);
                }

                function $If_1() {
                    return $return();
                }
            }.bind(this));
        },
        params
    };
};

var context = function Context() {
    return new Promise(function ($return, $error) {
        var _this, _createHandler, handler, params, server;

        _this = this;

        this.called = 0;
        this.data = '200';
        _createHandler = createHandler(function () {
            return _this.data;
        }), handler = _createHandler.handler, params = _createHandler.params;

        this.params = params;
        server = http.createServer(handler);
        this.server = server;
        enableDestroy(this.server);

        this._destroy = function () {
            return new Promise(function ($return, $error) {
                return Promise.resolve(new Promise(function (resolve) {
                    _this.server.destroy();
                    _this.server.on('close', resolve);
                })).then(function ($await_3) {
                    try {
                        return $return();
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }.bind(this), $error);
            }.bind(this));
        };
        return Promise.resolve(new Promise(function (resolve) {
            server.listen(undefined, 'localhost', resolve);
        })).then(function ($await_4) {
            try {
                this.address = server.address();
                this.url = `http://${this.address.address}:${this.address.port}`;
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
};

module.exports = context;