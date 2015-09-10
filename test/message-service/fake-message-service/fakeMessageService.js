angular.module("fakeMessageService", []).factory("fakeMessageService", function fakeMessageService() {
    var callbacksByRoom = {};
    return {
        onMessageReceived: function onMessageReceived(roomName, callback) {
            callbacksByRoom[roomName] = callback;
            console.error("callbacksByRoom", callbacksByRoom);
        },

        simulateMessageReceived: function(roomName){
            callbacksByRoom[roomName]();
        }
    };
});