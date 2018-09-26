"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class MixEffectKeyPatternCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KePt';
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.upstreamKeyerId = __1.Util.parseNumberBetween(rawCommand[1], 0, 3);
        this.properties = {
            style: __1.Util.parseEnum(rawCommand[2], __1.Enums.Pattern),
            size: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 10000),
            symmetry: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 10000),
            softness: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 10000),
            positionX: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(10), 0, 10000),
            positionY: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(12), 0, 10000),
            invert: rawCommand[14] === 1
        };
    }
    serialize() {
        const buffer = Buffer.alloc(16);
        buffer.writeUInt8(this.flag, 0);
        buffer.writeUInt8(this.mixEffect, 1);
        buffer.writeUInt8(this.upstreamKeyerId, 2);
        buffer.writeUInt8(this.properties.style, 3);
        buffer.writeUInt16BE(this.properties.size, 4);
        buffer.writeUInt16BE(this.properties.symmetry, 6);
        buffer.writeUInt16BE(this.properties.softness, 8);
        buffer.writeUInt16BE(this.properties.positionX, 10);
        buffer.writeUInt16BE(this.properties.positionY, 12);
        buffer[14] = this.properties.invert ? 1 : 0;
        return Buffer.concat([Buffer.from('CKPt', 'ascii'), buffer]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.patternSettings = Object.assign({}, this.properties);
    }
}
MixEffectKeyPatternCommand.MaskFlags = {
    style: 1 << 0,
    size: 1 << 1,
    symmetry: 1 << 2,
    softness: 1 << 3,
    positionX: 1 << 4,
    positionY: 1 << 5,
    invert: 1 << 6
};
exports.MixEffectKeyPatternCommand = MixEffectKeyPatternCommand;
//# sourceMappingURL=MixEffectKeyPatternCommand.js.map