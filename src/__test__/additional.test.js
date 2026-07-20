import { handleButtonClick, trackMousePosition, setupEventDelegation } from '../main'

// Тест 1: перевірка повторних натискань кнопки
describe('handleButtonClick', () => {
  test('logs the message after two button clicks', () => {
    document.body.innerHTML = '<button id="testButton">Click me</button>'

    handleButtonClick('testButton', 'Button clicked')

    // Натискаємо кнопку двічі
    const button = document.getElementById('testButton')
    button.click()
    button.click()

    // Перевіряємо кількість повідомлень
    expect(console.log).toHaveBeenCalledTimes(2)
  })
})

// Тест 2: перевірка нульових координат миші
describe('trackMousePosition', () => {
  test('logs zero mouse coordinates', () => {
    trackMousePosition()

    // Створюємо подію з нульовими координатами
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 0,
      clientY: 0
    })

    document.dispatchEvent(mouseMoveEvent)

    // Перевіряємо повідомлення в консолі
    expect(console.log).toHaveBeenCalledWith('Mouse X: 0, Mouse Y: 0')
  })
})

// Тест 3: перевірка натискання на сам список
describe('setupEventDelegation', () => {
  test('does not log when the list itself is clicked', () => {
    document.body.innerHTML = `
      <ul id="testList">
        <li>Item 1</li>
      </ul>
    `

    setupEventDelegation('#testList')

    // Натискаємо на список, а не на його елемент
    const list = document.getElementById('testList')
    list.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    // У консоль нічого не повинно виводитися
    expect(console.log).not.toHaveBeenCalled()
  })
})
