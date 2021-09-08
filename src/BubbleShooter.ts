class BubbleShooter extends eui.Component {
	public constructor() {
		super();
		this.skinName = "bubbleShooter";
	}

	private bubbles;
	private _algo: df.BubbleAlgo = new df.BubbleAlgo();
	protected childrenCreated() {
		let bubbles = this._algo.initBubbles(25, 4, Bubble);
		this.bubbles = bubbles;
		for (let i = 0; i < bubbles.length; i++) {
			this.addChild(bubbles[i] as any);
		}
		this.addBubble();

		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.addEventListener(egret.Event.ENTER_FRAME, this.onLoop, this);
	}

	private _cur: df.BubbleInterface;
	private addBubble() {
		let bubble = this._algo.createBubble();
		bubble.x = this.stage.stageWidth / 2;
		bubble.y = this.stage.stageHeight;
		this.addChild(bubble);
		this._cur = bubble;
	}

	private _fire = false;
	private onTap(e: egret.TouchEvent) {
		let angle = Math.atan2(e.stageY - this._cur.y, e.stageX - this._cur.x);
		this._speedX = Math.cos(angle) * this._speed;
		this._speedY = Math.sin(angle) * this._speed;
		this._fire = true;
	}

	private _speed = 10;
	private _speedX;
	private _speedY;
	private onLoop() {
		if (this._fire) {
			this._cur.x += this._speedX;
			this._cur.y += this._speedY;

			if (this._cur.x >= this.stage.stageWidth) {
				this._cur.x = this.stage.stageWidth;
				this._speedX *= -1;
			}
			if (this._cur.x <= 0) {
				this._cur.x = 0;
				this._speedX *= -1;
			}

			this.checkCollision();
		}
	}

	private _fireCount = 0;
	private checkCollision() {
		let arr = [];
		for (let i = 0; i < this.bubbles.length; i++) {
			let bubble = this.bubbles[i];
			if (bubble.visible && bubble.alpha == 1) {
				let dis = df.MathUtil.dis(this._cur, bubble);
				if (dis <= 50) {
					arr.push({ bubble, dis });
				}
			}
		}
		df.ArrayUtil.sortAscBy("dis", arr);

		if (arr[0]) {
			this._fire = false;
			this._algo.linkBubble(arr[0].bubble, this._cur);
			let unite = this._algo.getUniteBubbles(this._cur, true);
			for (let j = unite.length - 1; j > -1; j--) {
				if (unite[j].alpha != 1) {
					unite.splice(j, 1);
				}
			}

			if (unite.length > 2) {
				for (let j = 0; j < unite.length; j++) { // 消掉
					unite[j].visible = false;
				}

				let fallBubbles = this._algo.getFallBubbles(); // 下坠
				for (let j = 0; j < fallBubbles.length; j++) {
					fallBubbles[j].alpha = 0.1;
				}
			}

			this._fireCount++;
			this._fireCount %= 6;
			if (this._fireCount == 0) {
				let line = this._algo.addBubbleLine();
				for (let i = 0; i < line.length; i++) {
					this.addChild(line[i]);
				}
			}

			this.addBubble();
		}
	}

}