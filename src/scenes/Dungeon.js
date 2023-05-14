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
	}

	preload() {
		this.load.image('TILES', 'assets/DungeonTiles.png')
		this.load.tilemapTiledJSON('MAP', 'assets/dungeon.json')
	}

	create() {
		const MAP = this.make.tilemap({ key: 'MAP' })
		const TILESET = MAP.addTilesetImage('DungeonTiles', 'TILES')

		const WALLLAYER = MAP.createLayer('Tile Layer 2', TILESET, 0, 0)
		const GROUNDLAYER = MAP.createLayer('Tile Layer 1', TILESET, 0, 0)

		
		
		
		const LAYER = MAP.createBlankLayer('LAYER', TILESET)

		LAYER.putTileAt(2, 0, 0)

		function randomNumber(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		function createDungeon() {
			let X = 0
			let Y = 0
			for (let i = 0; i < _STEPS; i++) {
				let RANDOM = randomNumber(1, 4)
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
	}

	update() {

	}
}
