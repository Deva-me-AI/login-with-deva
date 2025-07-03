// Test file for Claude Code Action
export function greetUser(name: string): string {
  // This function could be improved
  if (name == "") {
    return "Hello, anonymous!"
  }
  return "Hello, " + name + "!"
}

// Test the function
const greeting = greetUser("Claude")
console.log(greeting)

// Another function that could use review
export function calculateSum(numbers: number[]): number {
  let sum = 0
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i]
  }
  return sum
}

// Test array
const testNumbers = [1, 2, 3, 4, 5]
console.log("Sum:", calculateSum(testNumbers))