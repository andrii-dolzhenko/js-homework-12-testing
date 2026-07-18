import { setupEventDelegation } from '../main'

describe('setupEventDelegation', () => {
  document.body.innerHTML = `
    <ul id="testList">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    `

  test('should log the text of the clicked list item', () => {
    const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    setupEventDelegation('#testList')

    const secondItem = document.querySelector('#testList li:nth-child(2)')
    secondItem.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/Item clicked:\s*Item 2/i))

    mockConsoleLog.mockRestore()
  })
})
