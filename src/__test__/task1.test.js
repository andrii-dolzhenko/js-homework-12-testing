import { handleButtonClick } from '../main'

describe('handleButtonClick', () => {
  beforeEach(() => {
    // Створення та додавання кнопки до DOM перед кожним тестом
    document.body.innerHTML = '<button id="testButton">Click me</button>'
  })

  test('logs the message to the console on button click', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    handleButtonClick('testButton', 'Test message')

    // Симулювання кліку на кнопку
    document.getElementById('testButton').click()

    expect(consoleSpy).toHaveBeenCalledWith('Test message')
    consoleSpy.mockRestore()
  })
})
