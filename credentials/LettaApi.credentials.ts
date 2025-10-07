import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Letta API credentials
 *
 * This credential type handles authentication for the Letta API.
 * It requires a bearer token that can be obtained from the Letta platform.
 *
 * @see https://docs.letta.com/api-reference/authentication
 */
export class LettaApi implements ICredentialType {
	name = 'lettaApi';
	displayName = 'Letta API';
	documentationUrl = 'https://docs.letta.com/api-reference';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'The API token for authenticating with Letta. You can obtain this from your Letta dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.letta.com',
			required: true,
			description:
				'The base URL for the Letta API. Use the default unless you are using a self-hosted instance.',
		},
	];

	/**
	 * Generic authentication configuration
	 * Uses Bearer token authentication in the Authorization header
	 */
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	/**
	 * Test the credentials by making a request to the Letta API
	 * This helps users verify their API token is valid
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/agents',
			method: 'GET',
		},
	};
}
