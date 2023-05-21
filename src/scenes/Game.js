import Phaser, { Time } from 'phaser'
import Vector2 from '../utilities/vector2'

const _TILESIZE = 16
const _WIDTH = 20
const _HEIGHT = 10
const _STEPS = 40

let _MAP = []

const TILES = {
    TOP_LEFT_WALL: 0,
    TOP_RIGHT_WALL: 1,
    BOTTOM_LEFT_WALL: 2,
    BOTTOM_RIGHT_WALL: 3,
    TOP_WALL: [
        {index: 4, weight: 4},
        {index: 5, weight: 1},
        {index: 6, weight: 1},
        {index: 7, weight: 1}
    ],
    RIGHT_WALL: [
        {index: 8, weight: 4},
        {index: 9, weight: 1},
        {index: 10, weight: 1},
        {index: 11, weight: 1}
    ],
    BOTTOM_WALL: [
        {index: 12, weight: 4},
        {index: 13, weight: 1},
        {index: 14, weight: 1},
        {index: 15, weight: 1}
    ],
    LEFT_WALL: [
        {index: 16, weight: 4},
        {index: 17, weight: 1},
        {index: 18, weight: 1},
        {index: 19, weight: 1}
    ],
    FLOOR: [
        {index: 20, weight: 20},
        {index: 21, weight: 1},
        {index: 22, weight: 1},
        {index: 23, weight: 1}
    ]
}

export default class GameDungeon extends Phaser.Scene {
	constructor() {
		super('game-scene')
        
		this.PLAYER = undefined
		this.CURSORS = undefined
		this.PLAYER_SPEED = undefined
        this.attackTime = 200
        this.isAttacking = false
        this.countdown = undefined
	}

	preload() {
		//this.load.image('TILES', 'assets/DungeonTiles.png')
		//this.load.tilemapTiledJSON('MAP', 'assets/dungeon.json')

        this.load.image('TILES', 'assets/tiles.png')

		this.load.spritesheet('CHARACTER', 'assets/chr.png', {
			frameWidth: 16,
			frameHeight: 32,
		});
	}

	create() {
		this.PLAYER_SPEED = 100
        //https://labs.phaser.io/edit.html?src=src/tilemap/dungeon%20generator.js
        this.createDungeon()

        this.MAP = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width:  _WIDTH*10, height: _HEIGHT*10})
        var TILESET = this.MAP.addTilesetImage('TILES', 'TILES', 16, 16)
        this.LAYER = this.MAP.createBlankLayer('LAYER1', TILESET)

        //this.cameras.main.setZoom(.7)

        for(var i = 0; i < _MAP.length; i++) {
            var TOP, RIGHT, BOTTOM, LEFT = false
            var x = _MAP[i].x
            var y = _MAP[i].y
            var w = 10
            var h = 10
            var wOffset = w+2
            var hOffset = h+2
            const v = new Vector2(x, y)

            if(_MAP.includes(v.x, v.y+1)) {
                TOP = true
            }
            if(_MAP.includes(v.x+1, v.y)) {
                RIGHT = true
            }
            if(_MAP.includes(v.x, v.y-1)) {
                BOTTOM = true
            }
            if(_MAP.includes(v.x-1, v.y)) {
                LEFT = true
            }

            this.MAP.weightedRandomize(TILES.FLOOR, (x*wOffset)+1, (y*hOffset)+1, w, h)
            this.MAP.putTileAt(TILES.TOP_LEFT_WALL, (x*wOffset), (y*hOffset))
            this.MAP.putTileAt(TILES.TOP_RIGHT_WALL, (x*wOffset)+w+1, (y*hOffset))
            this.MAP.putTileAt(TILES.BOTTOM_LEFT_WALL, (x*wOffset), (y*hOffset)+h+1)
            this.MAP.putTileAt(TILES.BOTTOM_RIGHT_WALL, (x*wOffset)+w+1, (y*hOffset)+h+1)

            if(!TOP) {
                this.MAP.weightedRandomize(TILES.TOP_WALL, (x*wOffset)+1, (y*hOffset), w, 1)
            }
            if(!RIGHT) {
                this.MAP.weightedRandomize(TILES.RIGHT_WALL, (x*wOffset)+w+1, (y*hOffset)+1, 1, h)
            }
            if(!BOTTOM) {
                this.MAP.weightedRandomize(TILES.BOTTOM_WALL, (x*wOffset)+1, (y*hOffset)+h+1, w, 1)
            }
            if(!RIGHT) {
                this.MAP.weightedRandomize(TILES.LEFT_WALL, (x*wOffset), (y*hOffset)+1, 1, h)
            }
        }

        this.LAYER.setCollisionByExclusion([ 20, 21, 22, 23 ])

        this.PLAYER = this.createPlayer()

        this.ENEMY = this.createEnemy()

        this.ENEMY.x = this.MAP.tileToWorldX(4)
        this.ENEMY.y = this.MAP.tileToWorldY(4)

        this.PLAYER.x = this.MAP.tileToWorldX(2)
        this.PLAYER.y = this.MAP.tileToWorldX(2)

        this.CAM = this.cameras.main

        this.CAM.startFollow(this.PLAYER, true, .05, .05)

        this.physics.add.collider(this.LAYER, this.PLAYER)

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

		this.CURSORS = this.input.keyboard.createCursorKeys();
	}

	createPlayer() {
		const PLAYER = this.physics.add.sprite(0, 0, 'CHARACTER')
        PLAYER.setSize(10, 15)
        PLAYER.setOffset(3, 16)
		//PLAYER.setCollideWorldBounds(true)

		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('CHARACTER', {
				start: 3,
				end: 7,
			}),
			frameRate: 18,
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

    createEnemy() {
        const ENEMY = this.physics.add.sprite(0, 0, 'CHARACTER') //BYT SENARE
        return ENEMY
    }

	randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

    getTime() {
        return new Date().getTime()
    }

	createDungeon() {
		let X = 0
		let Y = 0
        _MAP.push(new Vector2(X, Y))
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
            const v = new Vector2(X, Y)
            if(_MAP.includes(v) == false) {
                _MAP.push(v)
            }
		}
	}

    playerAttack() {
        this.RECT = this.add.rectangle(this.PLAYER.x, this.PLAYER.y, 10, 10).setStrokeStyle(1, 0xffff00)
    }

    finishedAttack() {
        this.isAttacking = false
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

        if(this.keySpace.isDown && this.isAttacking === false) {
            this.isAttacking = true
            this.attackCountdown = this.time.delayedCall(this.attackTime, this.finishedAttack, [], this)
            this.playerAttack()
        }

		if(this.PLAYER.body.velocity.x === 0 && this.PLAYER.body.velocity.y === 0) {
			this.PLAYER.anims.play('idle', true)
		}
	}
}
