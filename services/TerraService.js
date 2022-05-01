import { LCDClient, Coin } from '@terra-money/terra.js'
const terraClient = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID : 'bombay-12'
})

export default class TerraService{
    hello(){
        return 'Hello World'
    }
}
