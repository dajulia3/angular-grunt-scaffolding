module("Messaging").factory('messageService', function messageService() {
    return {
        onMessageReceived: function onMessageReceived(){
            throw "gotta implement this to spec!";
        }
    };
});