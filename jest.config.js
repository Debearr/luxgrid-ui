module.exports = {
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/", "/build/", "/out/"],
	transform: {},
	collectCoverage: false,
	testEnvironment: 'node',
};