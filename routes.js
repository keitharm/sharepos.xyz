var express = require('express');
var router  = express.Router();

router.get('/:code', function(req, res, next) {
    res.redirect('/#/joinSession/' + req.params.code);
});

router.post('/newSession', function(req, res, next) {
    Session.create({
        code: req.body.code,
        date: new Date().getTime()
    }, function(err, model) {

        res.sendStatus(200);
    });
});

router.post('/updatePos', function(req, res, next) {
    var body = req.body;
    Loc.create({
        guid: body.guid,
        date: body.locData[3],
        accuracy: body.locData[0],
        lat: body.locData[1],
        long: body.locData[2]
    }, function(err, model) {
        res.sendStatus(200);
    });
});

router.get('/validCode/:code', function(req, res, next) {
    Session.find({
        code: req.params.code
    }, function(err, result) {
        res.send(result.length !== 0 ? "bueno" : "no bueno");
    });
});

router.get('/getLocs/:guid', function(req, res, next) {
    Loc.find({
        guid: req.params.guid
    }, function(err, results) {
        res.send(results);
    });
});

module.exports = router;
