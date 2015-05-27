var roomModel = require("../models/roomModel.js").Room;

module.exports = {
    getRoomById: function (id, next) {
        roomModel.findOne({'_id': id}, function (err, result) {
            next(result);
        });
    },

    getRoomByNumber: function (number, next) {
        roomModel.findOne({'number': number}, function (err, result) {
            next(result);
        });
    },

    updateRoomById: function (id, obj, next) {
        roomModel.findOneAndUpdate({_id: id}, obj, {new: true}, function () {
            next();
        })
    },

    unassignRoomFromTenantById: function (id, next) {
        roomModel.findOneAndUpdate({tenant_id: id}, {tenant_id: ''}, {new: true}, function () {
            if (next) {
                next();
            }
        });
    },

    assignRoomToTenant: function (tenant_id, room_number, next) {
        roomModel.findOneAndUpdate({number: room_number}, {tenant_id: tenant_id}, {new: true}, function () {
            if (next) {
                next();
            }
        });
    },

    getAllRooms: function (next) {
        roomModel.find(function (err, collection) {
            next(collection);
        });
    },

    getAllAvailableRooms: function (next) {
        roomModel.find({'tenant_id': ''}, function (err, collection) {
            next(collection);
        });
    },

    deleteRoomById: function (id, next) {
        roomModel.findOneAndRemove({'_id': id}, function (err, result) {
            next(err);
        });
    },

    saveRoom: function (tenant, next) {
        var roomToSave = new roomModel(tenant);
        roomToSave.save(function (err, result) {
            console.log('roomHandler: ' + err ? 'err: ' + err : result);
            next(err);
        });
    }
};
