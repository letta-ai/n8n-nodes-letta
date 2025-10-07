import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Letta } from './Letta.node';
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INode,
	NodeParameterValueType,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * E2E tests for the Letta n8n node
 * Tests the full execution flow including parameter parsing and API calls
 */
describe('Letta Node E2E', () => {
	let letta: Letta;
	let mockExecuteFunctions: IExecuteFunctions;

	beforeEach(() => {
		letta = new Letta();

		const mockNode: INode = {
			id: 'test-node-id',
			name: 'Letta',
			type: 'n8n-nodes-base.letta',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		};

		// Mock the execute functions context
		mockExecuteFunctions = {
			getInputData: vi.fn(),
			getNodeParameter: vi.fn(),
			getCredentials: vi.fn(),
			getNode: vi.fn(() => mockNode),
			continueOnFail: vi.fn(() => false),
			helpers: {
				httpRequestWithAuthentication: vi.fn(),
			},
		} as unknown as IExecuteFunctions;
	});

	describe('Node Description', () => {
		it('should have correct node metadata', () => {
			expect(letta.description.displayName).toBe('Letta');
			expect(letta.description.name).toBe('letta');
			expect(letta.description.version).toBe(1);
			expect(letta.description.group).toContain('transform');
		});

		it('should require lettaApi credentials', () => {
			const credentials = letta.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials?.[0].name).toBe('lettaApi');
			expect(credentials?.[0].required).toBe(true);
		});

		it('should have sendMessage operation', () => {
			const operationProperty = letta.description.properties.find((p) => p.name === 'operation');
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.options).toEqual([
				{
					name: 'Send Message',
					value: 'sendMessage',
					description: 'Send a message to a Letta agent',
					action: 'Send a message to a Letta agent',
				},
			]);
		});
	});

	describe('Execute - Send Message', () => {
		it('should successfully send a message to Letta agent', async () => {
			const inputData: INodeExecutionData[] = [{ json: {} }];
			const mockResponse = {
				messages: [
					{
						id: 'msg_123',
						role: 'assistant',
						content: 'Hello! How can I help you?',
					},
				],
				usage: {
					step_count: 1,
				},
			};

			// Setup mocks
			vi.mocked(mockExecuteFunctions.getInputData).mockReturnValue(inputData);
			vi.mocked(mockExecuteFunctions.getNodeParameter).mockImplementation(
				(paramName: string): NodeParameterValueType => {
					const params: Record<string, NodeParameterValueType> = {
						operation: 'sendMessage',
						agentId: 'agent_abc123',
						role: 'user',
						message: 'Hello!',
						additionalOptions: {},
					};
					return params[paramName];
				},
			);
			vi.mocked(mockExecuteFunctions.getCredentials).mockResolvedValue({
				apiToken: 'test_token',
				baseUrl: 'https://api.letta.com',
			});
			vi.mocked(mockExecuteFunctions.helpers.httpRequestWithAuthentication).mockResolvedValue(
				mockResponse,
			);

			// Execute the node
			const result = await letta.execute.call(mockExecuteFunctions);

			// Verify results
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual(mockResponse);
			expect(result[0][0].pairedItem).toEqual({ item: 0 });

			// Verify API call
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'lettaApi',
				{
					method: 'POST',
					url: 'https://api.letta.com/v1/agents/agent_abc123/messages',
					body: {
						messages: [
							{
								role: 'user',
								content: 'Hello!',
							},
						],
					},
					json: true,
				},
			);
		});

		it('should send message with additional options', async () => {
			const inputData: INodeExecutionData[] = [{ json: {} }];
			const mockResponse = {
				messages: [
					{
						id: 'msg_456',
						role: 'assistant',
						content: 'Response with thinking enabled',
					},
				],
			};

			// Setup mocks with additional options
			vi.mocked(mockExecuteFunctions.getInputData).mockReturnValue(inputData);
			vi.mocked(mockExecuteFunctions.getNodeParameter).mockImplementation(
				(
					paramName: string,
					_itemIndex: number,
					defaultValue?: NodeParameterValueType,
				): NodeParameterValueType => {
					const params: Record<string, NodeParameterValueType> = {
						operation: 'sendMessage',
						agentId: 'agent_xyz789',
						role: 'user',
						message: 'Test with options',
						additionalOptions: {
							max_steps: 20,
							enable_thinking: true,
							use_assistant_message: false,
							include_return_message_types: ['internal_monologue', 'reasoning'],
						},
					};
					return params[paramName] ?? defaultValue;
				},
			);
			vi.mocked(mockExecuteFunctions.getCredentials).mockResolvedValue({
				apiToken: 'test_token',
				baseUrl: 'https://api.letta.com',
			});
			vi.mocked(mockExecuteFunctions.helpers.httpRequestWithAuthentication).mockResolvedValue(
				mockResponse,
			);

			// Execute the node
			await letta.execute.call(mockExecuteFunctions);

			// Verify the API call includes additional options
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'lettaApi',
				{
					method: 'POST',
					url: 'https://api.letta.com/v1/agents/agent_xyz789/messages',
					body: {
						messages: [
							{
								role: 'user',
								content: 'Test with options',
							},
						],
						max_steps: 20,
						enable_thinking: true,
						use_assistant_message: false,
						include_return_message_types: ['internal_monologue', 'reasoning'],
					},
					json: true,
				},
			);
		});

		it('should handle multiple input items', async () => {
			const inputData: INodeExecutionData[] = [{ json: { id: 1 } }, { json: { id: 2 } }];
			const mockResponse1 = { messages: [{ role: 'assistant', content: 'Response 1' }] };
			const mockResponse2 = { messages: [{ role: 'assistant', content: 'Response 2' }] };

			// Setup mocks
			vi.mocked(mockExecuteFunctions.getInputData).mockReturnValue(inputData);
			vi.mocked(mockExecuteFunctions.getNodeParameter).mockImplementation(
				(paramName: string, itemIndex: number): NodeParameterValueType => {
					const params: Record<string, NodeParameterValueType> = {
						operation: 'sendMessage',
						agentId: 'agent_test',
						role: 'user',
						message: `Message ${itemIndex + 1}`,
						additionalOptions: {},
					};
					return params[paramName];
				},
			);
			vi.mocked(mockExecuteFunctions.getCredentials).mockResolvedValue({
				apiToken: 'test_token',
				baseUrl: 'https://api.letta.com',
			});
			vi.mocked(mockExecuteFunctions.helpers.httpRequestWithAuthentication)
				.mockResolvedValueOnce(mockResponse1)
				.mockResolvedValueOnce(mockResponse2);

			// Execute the node
			const result = await letta.execute.call(mockExecuteFunctions);

			// Verify results
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockResponse1);
			expect(result[0][0].pairedItem).toEqual({ item: 0 });
			expect(result[0][1].json).toEqual(mockResponse2);
			expect(result[0][1].pairedItem).toEqual({ item: 1 });

			// Verify API was called twice
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
		});

		it('should handle API errors and throw NodeOperationError', async () => {
			const inputData: INodeExecutionData[] = [{ json: {} }];
			const apiError = new Error('API request failed: 401 Unauthorized');

			// Setup mocks
			vi.mocked(mockExecuteFunctions.getInputData).mockReturnValue(inputData);
			vi.mocked(mockExecuteFunctions.getNodeParameter).mockImplementation(
				(paramName: string): NodeParameterValueType => {
					const params: Record<string, NodeParameterValueType> = {
						operation: 'sendMessage',
						agentId: 'agent_invalid',
						role: 'user',
						message: 'Test',
						additionalOptions: {},
					};
					return params[paramName];
				},
			);
			vi.mocked(mockExecuteFunctions.getCredentials).mockResolvedValue({
				apiToken: 'invalid_token',
				baseUrl: 'https://api.letta.com',
			});
			vi.mocked(mockExecuteFunctions.helpers.httpRequestWithAuthentication).mockRejectedValue(
				apiError,
			);

			// Execute and expect error
			await expect(letta.execute.call(mockExecuteFunctions)).rejects.toThrow(NodeOperationError);
		});

		it('should continue on fail when continueOnFail is true', async () => {
			const inputData: INodeExecutionData[] = [{ json: {} }];
			const apiError = new Error('Network error');

			// Setup mocks
			vi.mocked(mockExecuteFunctions.getInputData).mockReturnValue(inputData);
			vi.mocked(mockExecuteFunctions.continueOnFail).mockReturnValue(true);
			vi.mocked(mockExecuteFunctions.getNodeParameter).mockImplementation(
				(paramName: string): NodeParameterValueType => {
					const params: Record<string, NodeParameterValueType> = {
						operation: 'sendMessage',
						agentId: 'agent_test',
						role: 'user',
						message: 'Test',
						additionalOptions: {},
					};
					return params[paramName];
				},
			);
			vi.mocked(mockExecuteFunctions.getCredentials).mockResolvedValue({
				apiToken: 'test_token',
				baseUrl: 'https://api.letta.com',
			});
			vi.mocked(mockExecuteFunctions.helpers.httpRequestWithAuthentication).mockRejectedValue(
				apiError,
			);

			// Execute the node
			const result = await letta.execute.call(mockExecuteFunctions);

			// Verify error is captured in output
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toHaveProperty('error');
			expect(result[0][0].pairedItem).toEqual({ item: 0 });
		});
	});
});
