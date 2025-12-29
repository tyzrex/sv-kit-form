/**
 * Common validation rules for form fields
 * Each validator returns null if valid, or an error message string if invalid
 */

import { SvelteDate } from 'svelte/reactivity';

export const validators = {
	/**
	 * Validates that a field has a value
	 */
	required: <T>(value: T): string | null => {
		if (value === null || value === undefined || value === '') {
			return 'This field is required';
		}
		return null;
	},

	/**
	 * Validates that a string contains only alphabetic characters and spaces
	 */
	alphabetsOnly: (value: string): string | null => {
		if (!value) return null; // Let required handle empty
		const alphaRegex = /^[A-Za-z\s]+$/;
		return alphaRegex.test(value) ? null : 'Only alphabets are allowed';
	},

	/**
	 * Validates email format
	 */
	email: (value: string): string | null => {
		if (!value) return null; // Let required handle empty
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value) ? null : 'Enter a valid email address';
	},

	/**
	 * Creates a validator for minimum string length
	 */
	minLength:
		(min: number) =>
		(value: string): string | null => {
			if (!value) return null;
			return value.length >= min ? null : `Must be at least ${min} characters`;
		},

	/**
	 * Creates a validator for maximum string length
	 */
	maxLength:
		(max: number) =>
		(value: string): string | null => {
			if (!value) return null;
			return value.length <= max ? null : `Must be at most ${max} characters`;
		},

	/**
	 * Validates phone number (10 digits)
	 */
	phone: (value: string): string | null => {
		if (!value) return null;
		const phoneRegex = /^\d{10}$/;
		const cleaned = value.replace(/[\s-]/g, '');
		return phoneRegex.test(cleaned) ? null : 'Enter a valid 10-digit phone number';
	},

	/**
	 * Creates a validator for minimum age based on date of birth
	 */
	age:
		(minAge: number) =>
		(dateString: string): string | null => {
			if (!dateString) return null;
			const today = new SvelteDate();
			const dob = new SvelteDate(dateString);
			let age = today.getFullYear() - dob.getFullYear();
			const monthDiff = today.getMonth() - dob.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
				age--;
			}
			return age >= minAge ? null : `You must be at least ${minAge} years old`;
		},

	/**
	 * Creates a validator with custom regex pattern
	 */
	pattern:
		(regex: RegExp, message: string) =>
		(value: string): string | null => {
			if (!value) return null;
			return regex.test(value) ? null : message;
		},

	/**
	 * Creates a custom validator function
	 */
	custom: <T>(validator: (value: T) => string | null) => validator,

	/**
	 * Validates URL format
	 */
	url: (value: string): string | null => {
		if (!value) return null;
		try {
			new URL(value);
			return null;
		} catch {
			return 'Enter a valid URL';
		}
	},

	/**
	 * Validates that value is a number
	 */
	number: (value: unknown): string | null => {
		if (value === null || value === undefined || value === '') return null;
		return !isNaN(Number(value)) ? null : 'Must be a valid number';
	},

	/**
	 * Creates a validator for minimum numeric value
	 */
	min:
		(minValue: number) =>
		(value: number): string | null => {
			if (value === null || value === undefined) return null;
			return value >= minValue ? null : `Must be at least ${minValue}`;
		},

	/**
	 * Creates a validator for maximum numeric value
	 */
	max:
		(maxValue: number) =>
		(value: number): string | null => {
			if (value === null || value === undefined) return null;
			return value <= maxValue ? null : `Must be at most ${maxValue}`;
		},

	/**
	 * Validates that a value matches another field (useful for password confirmation)
	 */
	matches:
		<T extends Record<string, unknown>>(fieldName: keyof T, message?: string) =>
		(value: unknown, formData?: T): string | null => {
			if (!formData) return null;
			return value === formData[fieldName] ? null : message || `Must match ${String(fieldName)}`;
		}
};
