import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { LettaClient, type Letta } from '@letta-ai/letta-client';

export interface SendMessageOptions {
	max_steps?: number;
	use_assistant_message?: boolean;
	enable_thinking?: boolean;
	include_return_message_types?: string[];
}

/**
 * Send a message to a Letta agent using the official Letta SDK
 *
 * @param this - The execution context
 * @returns Array of execution data for all input items
 */
export async function sendMessage(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			// Get credentials
			const credentials = await this.getCredentials('lettaApi');
			const baseUrl = credentials.baseUrl as string;
			const apiToken = credentials.apiToken as string;

			// Initialize Letta client
			const client = new LettaClient({
				baseUrl: baseUrl,
				token: apiToken,
			});

			// Get parameters
			const agentId = this.getNodeParameter('agentId', i) as string;
			const role = this.getNodeParameter('role', i) as Letta.MessageCreateRole;
			const message = this.getNodeParameter('message', i) as string;
			const additionalOptions = this.getNodeParameter(
				'additionalOptions',
				i,
				{},
			) as SendMessageOptions;

			// Build request body using SDK types
			const requestBody: Letta.LettaRequest = {
				messages: [
					{
						role,
						content: [
							{
								type: 'text',
								text: message,
							},
						],
					} as Letta.MessageCreate,
				],
			};

			// Add optional parameters (SDK uses camelCase)
			if (additionalOptions.max_steps !== undefined) {
				requestBody.maxSteps = additionalOptions.max_steps;
			}
			if (additionalOptions.use_assistant_message !== undefined) {
				requestBody.useAssistantMessage = additionalOptions.use_assistant_message;
			}
			if (additionalOptions.enable_thinking !== undefined) {
				// SDK expects string, convert boolean to string
				requestBody.enableThinking = additionalOptions.enable_thinking.toString();
			}
			if (additionalOptions.include_return_message_types?.length) {
				// Map UI values to SDK types
				const typeMap: Record<string, Letta.MessageType> = {
					internal_monologue: 'reasoning_message',
					function_call: 'tool_call_message',
					function_return: 'tool_return_message',
					reasoning: 'reasoning_message',
				};
				requestBody.includeReturnMessageTypes = additionalOptions.include_return_message_types.map(
					(type) => typeMap[type] || (type as Letta.MessageType),
				);
			}

			// Send message using SDK
			const response = await client.agents.messages.create(agentId, requestBody);

			// Return the response
			returnData.push({
				json: response as unknown as IDataObject,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error instanceof Error ? error.message : JSON.stringify(error),
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw new NodeOperationError(this.getNode(), error as Error, {
				itemIndex: i,
			});
		}
	}

	return returnData;
}
