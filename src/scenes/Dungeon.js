import Phaser from 'phaser'
import Vector2 from '../utilities/vector2'

const _TILESIZE = 32
const _WIDTH = 20
const _HEIGHT = 10
const _STEPS = 40

let _MAP = []

export default class HelloWorldScene extends Phaser.Scene {
	constructor() {
		super('dungeon-scene')
	}

	preload() {
		this.load.setBaseURL('https://labs.phaser.io')
		this.load.image('sky', 'assets/skies/space3.png')
		this.load.image('logo', 'assets/sprites/phaser3-logo.png')
		this.load.image('red', 'assets/particles/red.png')
	}

	create() {
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
