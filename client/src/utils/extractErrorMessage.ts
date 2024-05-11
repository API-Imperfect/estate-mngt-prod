export default function extractErrorMessage(error: unknown): string | null {
	if (typeof error === "object" && error !== null && "data" in error) {
		const errorData = (error as { data: any }).data;

		if ("detail" in errorData && typeof errorData.detail === "string") {
			return errorData.detail;
		}

		const messages: string[] = [];

		Object.keys(errorData).forEach((key) => {
			if (key !== "status_code") {
				const fieldError = errorData[key];
				if (Array.isArray(fieldError)) {
					messages.push(...fieldError);
				} else if (typeof fieldError === "object" && fieldError !== null) {
					Object.values(fieldError).forEach((errorMessages: any) => {
						if (Array.isArray(errorMessages)) {
							messages.push(...errorMessages);
						}
					});
				}
			}
		});
		return messages.length > 0 ? messages.join(", ") : null;
	}
	return null;
}
