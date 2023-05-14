import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import GameScene from './scenes/GameScene'
import Dungeon from './scenes/Dungeon'
import Game from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
    pixelArt: true,
    roundPixels: false,
	width: 320,
	height: 240,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [Game],
}

export default new Phaser.Game(config)

//https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-3-procedural-dungeon-3bc19b841cd