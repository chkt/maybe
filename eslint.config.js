import config from '@chkt/eslint-config/index.js';
import tseslint from 'typescript-eslint';


export default tseslint.config([
	...config,
	{
		languageOptions : {
			parserOptions : {
				projectService : true,
				tsconfigRootDir : import.meta.dirname
			}
		},
		ignores : [
			'/dist/',
			'/node_modules/'
		],
		rules : {}
	}
]);
