import Phaser from 'phaser'
import Vector2 from '../utilities/vector2'

const _TILESIZE = 16
const _WIDTH = 20
const _HEIGHT = 10
const _STEPS = 40

let _MAP = []

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('dungeon-scene')

		this.PLAYER = undefined
		this.CURSORS = undefined
		this.PLAYER_SPEED = undefined
	}

	preload() {
		this.load.image('TILES', 'assets/DungeonTiles.png')
		this.load.tilemapTiledJSON('MAP', 'assets/dungeon.json')

		this.load.spritesheet('CHARACTER', 'assets/chr.png', {
			frameWidth: 16,
			frameHeight: 32,
		});
	}

	create() {
		this.PLAYER_SPEED = 100
		this.PLAYER = this.createPlayer()

		const MAP = this.make.tilemap({ key: 'MAP' })
		const TILESET = MAP.addTilesetImage('DungeonTiles', 'TILES')

		const WALLLAYER = MAP.createLayer('Tile Layer 2', TILESET, 0, 0)
		const GROUNDLAYER = MAP.createLayer('Tile Layer 1', TILESET, 0, 0)

		const LAYER = MAP.createBlankLayer('LAYER', TILESET)

		LAYER.putTileAt(2, 0, 0)

		this.CURSORS = this.input.keyboard.createCursorKeys();
	}

	createPlayer() {
		const PLAYER = this.physics.add.sprite(0, 0, 'CHARACTER')
		PLAYER.setCollideWorldBounds(true)

		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('CHARACTER', {
				start: 3,
				end: 7,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('CHARACTER', {
				start: 0,
				end: 1,
			}),
			frameRate: 2,
			repeat: -1,
		})
		return PLAYER
	}

	randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	createDungeon() {
		let X = 0
		let Y = 0
		for (let i = 0; i < _STEPS; i++) {
			let RANDOM = this.randomNumber(1, 4)
			switch (RANDOM) {
				case 1: //Up
					if (Y < _HEIGHT) {
						Y++
					}
					break

				case 2: //Right
					if (X < _WIDTH) {
						X++
					}
					break

				case 3: //Down
					if (Y > 0) {
						Y--
					}
					break

				case 4: //Left
					if (X > 0) {
						X--
					}
					break
			}
			_MAP.push(new Vector2(X, Y))
		}
	}

	update() {
		this.PLAYER.setVelocity(0);

        if (this.CURSORS.left.isDown)
        {
            this.PLAYER.setVelocityX(-this.PLAYER_SPEED);
			this.PLAYER.anims.play('run', true)
			this.PLAYER.flipX = true
        }
        else if (this.CURSORS.right.isDown)
        {
            this.PLAYER.setVelocityX(this.PLAYER_SPEED);
			this.PLAYER.anims.play('run', true)
			this.PLAYER.flipX = false
        }

        if (this.CURSORS.up.isDown)
        {
            this.PLAYER.setVelocityY(-this.PLAYER_SPEED);
			this.PLAYER.anims.play('run', true)
        }
        else if (this.CURSORS.down.isDown)
        {
            this.PLAYER.setVelocityY(this.PLAYER_SPEED);
			this.PLAYER.anims.play('run', true)
        }

		if(this.PLAYER.body.velocity.x === 0 && this.PLAYER.body.velocity.y === 0) {
			this.PLAYER.anims.play('idle', true)
		}
	}
}
