export interface FormConfig<T = Record<string, unknown>> {
	initialValues: T;
	onSubmit: (values: T) => void | Promise<void>;
	validate?: (values: T) => Record<string, string>;
}

export interface FormState<T = Record<string, unknown>> {
	values: T;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	isSubmitting: boolean;
	isValid: boolean;
}
