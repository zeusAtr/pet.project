module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/tests/**/*.ts'],
    reporters: [
        "default",
        [ "jest-html-reporter", {
            pageTitle: "Test Report",
            outputPath: "./reports/test-report.html"
        }]
    ]
};