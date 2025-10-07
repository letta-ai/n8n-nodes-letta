import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { sendMessage } from './actions/sendMessage';

/**
 * Letta Node
 *
 * This node provides integration with the Letta AI agent platform.
 * It allows you to send messages to Letta agents and receive responses.
 *
 * @see https://docs.letta.com/api-reference
 */
export class Letta implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Letta',
		name: 'letta',
		icon: 'file:letta.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Letta AI agents',
		defaults: {
			name: 'Letta',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lettaApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Operation selection
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a message to a Letta agent',
						action: 'Send a message to a Letta agent',
					},
				],
				default: 'sendMessage',
			},

			// Agent ID field
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'The ID of the Letta agent to send the message to',
				placeholder: 'agent_abc123',
			},

			// Message role
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				options: [
					{
						name: 'User',
						value: 'user',
						description: 'Message from the user',
					},
					{
						name: 'System',
						value: 'system',
						description: 'System message',
					},
					{
						name: 'Assistant',
						value: 'assistant',
						description: 'Message from the assistant',
					},
				],
				default: 'user',
				description: 'The role of the message sender',
			},

			// Message content
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'The message content to send to the agent',
				typeOptions: {
					rows: 4,
				},
			},

			// Additional Options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				options: [
					{
						displayName: 'Max Steps',
						name: 'max_steps',
						type: 'number',
						default: 10,
						description: 'Maximum number of steps the agent can take when processing this message',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
					},
					{
						displayName: 'Use Assistant Message',
						name: 'use_assistant_message',
						type: 'boolean',
						default: true,
						description: 'Whether to use an assistant message in the response',
					},
					{
						displayName: 'Enable Thinking',
						name: 'enable_thinking',
						type: 'boolean',
						default: false,
						description: 'Whether to enable the agent\'s thinking process in the response',
					},
					{
						displayName: 'Return Message Types',
						name: 'include_return_message_types',
						type: 'multiOptions',
						options: [
							{
								name: 'Internal Monologue',
								value: 'internal_monologue',
							},
							{
								name: 'Function Call',
								value: 'function_call',
							},
							{
								name: 'Function Return',
								value: 'function_return',
							},
							{
								name: 'Reasoning',
								value: 'reasoning',
							},
						],
						default: [],
						description: 'Types of messages to include in the response',
					},
				],
			},
		],
	};

	/**
	 * Execute the node
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0);

		let returnData: INodeExecutionData[];

		if (operation === 'sendMessage') {
			returnData = await sendMessage.call(this);
		} else {
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
		}

		return [returnData];
	}
}
