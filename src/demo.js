import { handleButtonClick, trackMousePosition, setupEventDelegation } from './main.js'

handleButtonClick('primaryButton', 'Primary button clicked!')
handleButtonClick('secondaryButton', 'Secondary button clicked!')

trackMousePosition()

setupEventDelegation('#eventList')
