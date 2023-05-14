import Phaser from 'phaser'
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

            if(_MAP.includes(new Vector2(x, y+1))) {
                TOP = true
            }
            if(_MAP.includes(new Vector2(x+1, y))) {
                RIGHT = true
            }
            if(_MAP.includes(new Vector2(x, y-1))) {
                BOTTOM = true
            }
            if(_MAP.includes(new Vector2(x-1, y))) {
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
            if(_MAP.includes(new Vector2(X, Y)) == false) {
                _MAP.push(new Vector2(X, Y))
            }
		}
	}

	update() {

	}
}
