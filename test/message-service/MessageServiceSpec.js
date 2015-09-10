describe("Real message service spec- maybe a websocket implementation or something", function () {
    describe("It conforms to the contract for a message service, alright!", function () {
        var messageService, fakeWebsocket;
        beforeEach(function () {
            module("Messaging");
            inject(function (_messageService_, _fakeWebsocket_) { //TODO explore constructing these outside angular... what would a project like that look like
                messageService = _messageService_;
                fakeWebsocket = _fakeWebsocket_;
            });
        });

        function simulateMessageReceived(roomName) {
            fakeWebsocket.simulateInboundJsonFrame({message: {roomName: roomName, body: "hello there!"}});
        }

        messageServiceContractSpecs(function () {
            return messageService;
        }, simulateMessageReceived);
    });
});