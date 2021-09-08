class Bubble extends eui.Component implements df.BubbleInterface {
	public constructor() {
		super();
		this.skinName = "bubble";
	}

	public tag = "bubble";
	public type: number;
	public row;

	private _colors = [0xff0000, 0x00ff00, 0xffff00, 0x999999];
	protected childrenCreated() {
		let shape = new egret.Shape();
		let g = shape.graphics;
		g.beginFill(this._colors[this.type]);
		g.drawCircle(25, 25, 25);
		g.endFill();
		this.addChild(shape);

		this.anchorOffsetX = this.anchorOffsetY = this.width / 2;

		this.touchEnabled = true;
		this.touchChildren = false;
	}
}