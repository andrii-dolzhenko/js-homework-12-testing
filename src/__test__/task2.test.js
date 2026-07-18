import { trackMousePosition } from '../main'

describe('trackMousePosition', () => {
  test('should log mouse position to the console on mousemove event', () => {
    // Мок document.addEventListener
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    const mockConsoleLog = vi.spyOn(console, 'log')

    // Викликаємо функцію для встановлення обробника події
    trackMousePosition()

    // Створюємо фейкову подію mousemove і викликаємо обробник події
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })
    addEventListenerSpy.mock.calls[0][1](mouseMoveEvent)

    // Перевіряємо, що було виведено в консоль
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/Mouse X:\s*100,\s*Mouse Y:\s*200/i))

    // Очищуємо моки
    addEventListenerSpy.mockRestore()
    mockConsoleLog.mockRestore()
  })
})
