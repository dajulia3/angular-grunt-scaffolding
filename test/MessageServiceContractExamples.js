function messageServiceContractSpecs(getChatServiceFn, simulateMessageReceivedFn) {
    describe("chatServiceContractSpec", function () {
        var chatService;
        beforeEach(function () {
            chatService = getChatServiceFn();
        });

        describe("onMessageReceived", function () {
            it("calls the registered callback for the room", function () {
                var messageReceivedCallback = jasmine.createSpy("callbackSpy");
                var anotherMessageReceivedCallback = jasmine.createSpy("anotherCallbackSpy");
                chatService.onMessageReceived("ROOM-123", messageReceivedCallback);
                chatService.onMessageReceived("ROOM-456", anotherMessageReceivedCallback);
                simulateMessageReceivedFn("ROOM-123");
                expect(messageReceivedCallback).toHaveBeenCalled();
                simulateMessageReceivedFn("ROOM-456");
                expect(anotherMessageReceivedCallback).toHaveBeenCalled();
            });
        });
    });
}