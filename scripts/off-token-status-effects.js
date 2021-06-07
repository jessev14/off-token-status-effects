import { libWrapper } from '../lib/shim.js';

Hooks.once("init", () => {
    libWrapper.register("off-token-status-effects", "Token.prototype.drawEffects", newDrawEffects, "WRAPPER");
});

async function newDrawEffects(wrapped, ...args) {
    // call original method to create status spirtes and background
    await wrapped.call(this);

    // destroy original background and replace with a copy at the same index
    this.effects.children[0]?.destroy();
    const newBG = this.effects.addChildAt(new PIXI.Graphics(), 0).beginFill(0x000000, 0.40).lineStyle(1.0, 0x000000);

    // re-set effect sprite positions and draw new backgrounds with new sprite position
    const w = Math.round(canvas.dimensions.size / 2 / 5) * 2;
    const nr = Math.floor(this.data.height * 5);
    for (let i = 0; i < this.effects.children.length - 1; i++) {
        const x = (i % nr) * w;
        const y = Math.floor(i / nr) * w * -1 - w;
        this.effects.children[i + 1].position.set(x, y);
        newBG.drawRoundedRect(x + 1, y + 1, w - 2, w - 2, 2);
    }
}
