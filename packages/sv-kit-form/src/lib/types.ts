/**
 * Type definitions for sv-kit-form
 */

import type { SvelteSet, SvelteMap } from 'svelte/reactivity';

export type ValidationRule<T = any> = (value: T, formData?: Record<string, any>) => string | null;

export type ValidationSchema<T extends Record<string, any>> = {
	[K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[];
};

export interface FormOptions<T extends Record<string, any>> {
	initialValues: T;
	validationSchema?: ValidationSchema<T>;
	onSubmit?: (values: T) => void | Promise<void>;
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
}

export interface FormFieldState {
	value: any;
	error: string;
	touched: boolean;
	dirty: boolean;
}

export interface FieldProps<T = any, K = string> {
	value: T;
	errorMessage?: string;
	fieldName: string;
	registerRef: <F extends K>(field: F, ref: HTMLElement | null) => void;
	onchange: (value: T) => void;
	onblur: () => void;
}

export interface FormReturn<T extends Record<string, any>> {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: SvelteSet<keyof T>;
	dirty: SvelteSet<keyof T>;
	isSubmitting: boolean;
	isValid: boolean;
	fieldRefs: SvelteMap<keyof T, HTMLElement | null>;
	setValue: <K extends keyof T>(field: K, value: T[K]) => void;
	setError: <K extends keyof T>(field: K, error: string) => void;
	clearError: <K extends keyof T>(field: K) => void;
	validateField: <K extends keyof T>(field: K) => boolean;
	validateForm: () => boolean;
	handleBlur: <K extends keyof T>(field: K) => void;
	handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
	handleSubmit: (e?: SubmitEvent) => Promise<void>;
	scrollToFirstError: () => void;
	registerFieldRef: <K extends keyof T>(field: K, ref: HTMLElement | null) => void;
	getFieldProps: <K extends keyof T>(field: K) => FieldProps<T[K]>;
	reset: () => void;
	resetErrors: () => void;
}
