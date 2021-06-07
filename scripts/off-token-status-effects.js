import { libWrapper } from '../lib/shim.js';

Hooks.once("init", () => {
    game.settings.register("off-token-status-effects", "otse-enabled", {
        name: "Enable Status Effect Icon Offset",
        hint: "",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => window.location.reload()
    });

    game.settings.register("off-token-status-effects", "otse-scaling", {
        name: "Status Effect Icon Scaling",
        hint: "",
        scope: "client",
        config: true,
        type: Number,
        default: 1,
        range: {
            min: 0.1,
            max: 2,
            step: 0.1
        },
        onChange: () => window.location.reload()
    });

    libWrapper.register("off-token-status-effects", "Token.prototype.drawEffects", newDrawEffects, "WRAPPER");
});

async function newDrawEffects(wrapped, ...args) {
    // call original method to create status spirtes and background
    await wrapped.call(this);
    if (!game.settings.get("off-token-status-effects", "otse-enabled")) return;
    // destroy original background and replace with a copy at the same index
    this.effects.children[0]?.destroy();
    const newBG = this.effects.addChildAt(new PIXI.Graphics(), 0).beginFill(0x000000, 0.40).lineStyle(1.0, 0x000000);

    // re-set effect sprite positions and draw new backgrounds with new sprite position
    //const w = Math.round(canvas.dimensions.size / 2 / 5) * 2;
    const w = game.settings.get("off-token-status-effects", "otse-scaling") * Math.round(canvas.dimensions.size / 2 / 5) * 2;
    //const nr = Math.floor(this.data.height * 5);
    const nr = Math.floor(this.data.height * (this.width / w));
    for (let i = 0; i < this.effects.children.length - 1; i++) {
        if (this.effects.children[i + 1].alpha === 0.80) continue; 
        const x = (i % nr) * w;
        const y = Math.floor(i / nr) * w * -1 - w;
        this.effects.children[i + 1].width = this.effects.children[i + 1].height = w;
        this.effects.children[i + 1].position.set(x, y);
        newBG.drawRoundedRect(x + 1, y + 1, w - 2, w - 2, 2);
    }
}
