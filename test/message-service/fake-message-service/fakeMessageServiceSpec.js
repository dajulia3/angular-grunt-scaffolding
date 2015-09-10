describe("fakeMessageService", function () {
    var fakeMessageService;
    beforeEach(function () {
        module("fakeMessageService");
        inject(function (_fakeMessageService_) {
            fakeMessageService = _fakeMessageService_;
        });
    });


    function simulateMessageReceived(roomName) {
        fakeMessageService.simulateMessageReceived(roomName);
    }

    messageServiceContractSpecs(function () {
        return fakeMessageService;
    }, simulateMessageReceived);
});