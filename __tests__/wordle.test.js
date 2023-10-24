import { jest } from '@jest/globals'

// Lodash Mock for grabbing a random word.
const mockIsWord = jest.fn(() => true)
jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord
    }
})

// Asynchronous function imports to run after the mock.
const { buildLetter, Wordle } = await import('../src/wordle.js')

// Test to verify that the letter and status are passed correctly.
describe('Building the Letter Object', () => {
    test('Returns a Letter Object', () => {
        const letter = buildLetter('Q','CORRECT')
        expect(letter).toEqual({ letter: 'Q', status: 'CORRECT'})
    })
})

// Group of tests that will test the Wordle constructor.
describe('Constructing a new Wordle game', () => {
    test('maxGuesses is set to 6 if no argument is passed', () => {
        const wordle = new Wordle()
        expect(wordle.maxGuesses).toBe(6)
    })

    test(`maxGuesses is set to the argument that's passed`, () => {
         const wordle = new Wordle(10)
         expect(wordle.maxGuesses).toBe(10)
    })

    test('Check if the guesses array length is equal to maxGuesses', () => {
        const wordle = new Wordle()
        expect(wordle.guesses.length).toEqual(6)
    })

    test('Verify that currGuess is set to 0', () => {
        const wordle = new Wordle()
        expect(wordle.currGuess).toBe(0)
    })

    test('Verify that it sets word to result of getWord', () => {
        const wordle = new Wordle()
        expect(wordle.word).toBe('APPLE')
    })
})

describe('Analyzing a guess based off of the word', () => {
    test('Verify the letter status of a correct letter is set correctly', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('A____')
        expect(guess[0].status).toBe('CORRECT')
    })

    test('Verify the letter status of a present letter is set correctly', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('E____')
        expect(guess[0].status).toBe('PRESENT')
    })

    test('Verify the letter status of an incorrect letter is set correctly', () => {
        const wordle = new Wordle()
        const guess = wordle.buildGuessFromWord('Z____')
        expect(guess[0].status).toBe('ABSENT')
    })
})

describe('Verify error handling from appendGuess', () => {
    test('Throw error if no more guesses are allowed', () => {
        const wordle = new Wordle(1)
        wordle.appendGuess('guess')
        expect(() => wordle.appendGuess('guess')).toThrow()
    })

    test('Throw error if the guess is not a length of 5', () => {
        const wordle = new Wordle()
        expect(() => wordle.appendGuess('guessTooLong')).toThrow()
    })

    // NOTE: In order for this test to pass, the value of mockIsWord needs to be updated to false on line 4.
    // test('Throw error if the guess is not a word', () => {
    //     const wordle = new Wordle()
    //     expect(() => wordle.appendGuess('guess')).toThrow()
    // })

    test('Verify that the current guess value is incremented by 1', () => {
        const wordle = new Wordle()
        wordle.appendGuess('guess')
        expect(wordle.currGuess).toBe(1)
    })
})

describe('Checking to see if the Wordle has been solved', () => {
    test('Verify that the latest guess is the correct word', () => {
        const wordle = new Wordle()
        wordle.appendGuess('APPLE')
        expect(wordle.isSolved()).toBe(true)
    })

    test('Verify that the latest guess is not the correct word', () => {
        const wordle = new Wordle()
        wordle.appendGuess('FRUIT')
        expect(wordle.isSolved()).toBe(false)
    })
})

describe('Checking to see if the game should end', () => {
    test('Verify that the game should end if the correct word has been guessed', () => {
        const wordle = new Wordle()
        wordle.appendGuess('APPLE')
        expect(wordle.shouldEndGame()).toBe(true)
    })

    test('Verify that the game should end if there are no more guesses left', () => {
        const wordle = new Wordle(1)
        wordle.appendGuess('guess')
        expect(wordle.shouldEndGame()).toBe(true)
    })

    test('Verify that the game should not end if no guess has been made', () => {
        const wordle = new Wordle()
        expect(wordle.shouldEndGame()).toBe(false)
    })

    test('Verify that the game should not end if there are still remaining guesses', () => {
        const wordle = new Wordle()
        wordle.appendGuess('guess')
        expect(wordle.shouldEndGame()).toBe(false)
    })
})