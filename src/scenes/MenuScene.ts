import Phaser from 'phaser';
import type {AssetManifest} from '../content/manifest';
import {createEnvironment} from '../entities/environment';
import type {AppUI} from '../ui/AppUI';
export class MenuScene extends Phaser.Scene {
  constructor(private manifest:AssetManifest,private ui:AppUI){super('menu')}
  create(){createEnvironment(this,this.manifest.assets);this.ui.menu()}
}
