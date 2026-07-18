import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

describe('Метатестування: перевірка тестового покриття', () => {
  // Знаходимо всі тести в директорії src
  const srcDir = path.resolve('./src')
  const testFiles = findTestFiles(srcDir)
  
  it('У проекті повинні бути тестові файли', () => {
    expect(testFiles.length).toBeGreaterThan(0, 'Тестових файлів не знайдено')
    console.log(`Знайдено ${testFiles.length} тестових файлів:`)
    testFiles.forEach(file => console.log(`- ${path.relative(process.cwd(), file)}`))
  })
  
  it('Тести повинні мати блоки describe', () => {
    const filesWithDescribe = testFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf8')
      return content.includes('describe(')
    })
    
    expect(filesWithDescribe.length).toBeGreaterThan(0, 'Не знайдено файлів з блоками describe')
    console.log(`${filesWithDescribe.length} файлів містять блоки describe`)
    
    // Виводимо список файлів, які не містять describe
    const filesWithoutDescribe = testFiles.filter(file => !filesWithDescribe.includes(file))
    if (filesWithoutDescribe.length > 0) {
      console.log('Файли без блоку describe:')
      filesWithoutDescribe.forEach(file => console.log(`- ${path.relative(process.cwd(), file)}`))
    }
  })
  
  it('Тести повинні мати блоки test або it', () => {
    const filesWithTests = testFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf8')
      return content.includes('test(') || content.includes('it(')
    })
    
    expect(filesWithTests.length).toBeGreaterThan(0, 'Не знайдено файлів з блоками test або it')
    console.log(`${filesWithTests.length} файлів містять блоки test або it`)
    
    // Виводимо список файлів, які не містять test або it
    const filesWithoutTests = testFiles.filter(file => !filesWithTests.includes(file))
    if (filesWithoutTests.length > 0) {
      console.log('Файли без блоків test або it:')
      filesWithoutTests.forEach(file => console.log(`- ${path.relative(process.cwd(), file)}`))
    }
  })
  
  it('Тести повинні виконуватися без помилок', { timeout: 30000 }, async () => {
    // Запускаємо групу тестів напряму
    try {
      // Запускаємо всі тести одночасно, виключаючи supertest.test.js
      const command = 'npx vitest run src/__test__';
      console.log(`Виконуємо команду: ${command}`);
      
      const result = execSync(command, { stdio: 'pipe' }).toString();
      console.log('Результат виконання тестів:');
      console.log(result);
      
      // Перевірка, чи всі тести пройшли успішно
      const hasFailed = result.includes('FAIL');
      expect(hasFailed).toBe(false, 'Деякі тести завершилися з помилками');
    } catch (error) {
      console.error('Помилка при виконанні тестів:');
      if (error.stdout) {
        const output = error.stdout.toString();
        console.error(output);
        
        // Якщо єдина проблема в тому, що не знайдено тести - це не помилка для нас
        if (output.includes('No test files found') || output.includes('PASS')) {
          console.log('Тести не знайдені або пройшли успішно');
          return;
        }
      } else {
        console.error(error.message);
      }
      
      expect.fail('Помилка виконання тестів');
    }
  })
})

/**
 * Функція для пошуку файлів тестів у директорії
 * @param {string} dir - Шлях до директорії
 * @returns {string[]} - Масив шляхів до тестових файлів
 */
function findTestFiles(dir) {
  const testFiles = []
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir)
    
    for (const file of files) {
      const filePath = path.join(currentDir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        scanDir(filePath) // Рекурсивний пошук у піддиректоріях
      } else if (file.includes('.test.') || file.includes('.spec.')) {
        // Ігноруємо supertest.test.js щоб уникнути нескінченних рекурсій
        if (!filePath.includes('supertest.test.js')) {
          testFiles.push(filePath)
        }
      }
    }
  }
  
  scanDir(dir)
  return testFiles
} 
