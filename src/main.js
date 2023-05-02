import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import GameScene from './scenes/GameScene'
import Dungeon from './scenes/Dungeon'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
		},
	},
	scene: [Dungeon],
}

export default new Phaser.Game(config)

//https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-3-procedural-dungeon-3bc19b841cd