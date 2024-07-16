// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     setupFiles: ['dotenv/config'],
//     moduleNameMapper: {
//         '^@/(.*)$': '<rootDir>/src/$1',
//     },
// };
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    }
};