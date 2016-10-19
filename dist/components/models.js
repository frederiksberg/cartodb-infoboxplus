"use strict";
var InfoModel = (function () {
    function InfoModel(inputA, inputB) {
        this.testString = inputA + " " + inputB;
    }
    InfoModel.prototype.saySomething = function () {
        console.log(this.testString);
        return this.testString;
    };
    return InfoModel;
}());
exports.InfoModel = InfoModel;
//# sourceMappingURL=models.js.map