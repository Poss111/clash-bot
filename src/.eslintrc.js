module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'es2021': true,
		'jest/globals': true
	},
	'plugins': [
		'jest'
	],
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
