import {
	IExecuteFunctions,
	INodeExecutionData,
	JsonObject,
	NodeOperationError,
} from 'n8n-workflow';

export interface SendMessageOptions {
	max_steps?: number;
	use_assistant_message?: boolean;
	enable_thinking?: boolean;
	include_return_message_types?: string[];
}

/**
 * Send a message to a Letta agent
 *
 * @param this - The execution context
 * @returns Array of execution data for all input items
 */
export async function sendMessage(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			// Get credentials to access baseUrl
			const credentials = await this.getCredentials('lettaApi');
			const baseUrl = credentials.baseUrl as string;

			// Get parameters
			const agentId = this.getNodeParameter('agentId', i) as string;
			const role = this.getNodeParameter('role', i) as string;
			const message = this.getNodeParameter('message', i) as string;
			const additionalOptions = this.getNodeParameter(
				'additionalOptions',
				i,
				{},
			) as SendMessageOptions;

			// Build request body
			const body: JsonObject = {
				messages: [
					{
						role,
						content: message,
					},
				],
			};

			// Add optional parameters
			if (additionalOptions.max_steps !== undefined) {
				body.max_steps = additionalOptions.max_steps;
			}
			if (additionalOptions.use_assistant_message !== undefined) {
				body.use_assistant_message = additionalOptions.use_assistant_message;
			}
			if (additionalOptions.enable_thinking !== undefined) {
				body.enable_thinking = additionalOptions.enable_thinking;
			}
			if (additionalOptions.include_return_message_types?.length) {
				body.include_return_message_types = additionalOptions.include_return_message_types;
			}

			// Make API request
			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'lettaApi', {
				method: 'POST',
				url: `${baseUrl}/v1/agents/${agentId}/messages`,
				body,
				json: true,
			});

			// Add response to return data
			returnData.push({
				json: response as JsonObject,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: typeof error === 'string' ? error : JSON.stringify(error),
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
