/**
 * Form validation utility for Svelte 5
 * Provides a clean API for form validation with automatic error clearing
 */

import { SvelteSet, SvelteMap } from 'svelte/reactivity';
import type { FormOptions, FormReturn, FieldProps } from './types';

/**
 * Creates a form instance with validation, state management, and submission handling
 *
 * @example
 * ```ts
 * import { createForm, validators } from 'sv-kit-form';
 *
 * const form = createForm({
 *   initialValues: { email: '', password: '' },
 *   validationSchema: {
 *     email: [validators.required, validators.email],
 *     password: [validators.required, validators.minLength(8)]
 *   },
 *   onSubmit: async (values) => {
 *     await api.login(values);
 *   }
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createForm<T extends Record<string, any>>(options: FormOptions<T>): FormReturn<T> {
	const {
		initialValues,
		validationSchema,
		onSubmit,
		validateOnChange = true,
		validateOnBlur = true
	} = options;

	// State - using Svelte 5 runes
	let values = $state<T>({ ...initialValues }) as T;
	let errors = $state<Partial<Record<keyof T, string>>>({});
	let touched = new SvelteSet<keyof T>();
	let dirty = new SvelteSet<keyof T>();
	let isSubmitting = $state(false);
	const fieldRefs = new SvelteMap<keyof T, HTMLElement | null>();

	// Computed
	const isValid = $derived(Object.keys(values).every((key) => !errors[key as keyof T]));

	/**
	 * Validates a single field against its validation rules
	 */
	const validateField = <K extends keyof T>(field: K): boolean => {
		if (!validationSchema || !validationSchema[field]) {
			return true;
		}

		const rule = validationSchema[field];
		const value = values[field];
		const rules = Array.isArray(rule) ? rule : [rule];

		// Normalize empty values for validation (null, undefined, empty string)
		const normalizedValue = value === null || value === undefined || value === '' ? '' : value;

		for (const validateRule of rules) {
			const error = validateRule(normalizedValue, values);
			if (error) {
				errors[field] = error;
				return false;
			}
		}

		// Clear error if validation passes
		delete errors[field];
		return true;
	};

	/**
	 * Validates all fields in the form
	 */
	const validateForm = (): boolean => {
		// Mark all fields as touched
		Object.keys(values).forEach((key) => {
			touched.add(key as keyof T);
		});

		if (!validationSchema) {
			return true;
		}

		let isFormValid = true;
		Object.keys(validationSchema).forEach((key) => {
			if (!validateField(key as keyof T)) {
				isFormValid = false;
			}
		});

		return isFormValid;
	};

	/**
	 * Sets the value of a field and optionally validates it
	 */
	const setValue = <K extends keyof T>(field: K, value: T[K]) => {
		values[field] = value;
		dirty.add(field);

		// Clear error on change if validateOnChange is enabled
		if (validateOnChange && touched.has(field)) {
			clearError(field);
			validateField(field);
		}
	};

	/**
	 * Sets an error message for a field
	 */
	const setError = <K extends keyof T>(field: K, error: string) => {
		errors[field] = error;
	};

	/**
	 * Clears the error message for a field
	 */
	const clearError = <K extends keyof T>(field: K) => {
		delete errors[field];
	};

	/**
	 * Handles blur event for a field
	 */
	const handleBlur = <K extends keyof T>(field: K) => {
		touched.add(field);
		if (validateOnBlur) {
			validateField(field);
		}
	};

	/**
	 * Handles change event for a field
	 */
	const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
		setValue(field, value);
	};

	/**
	 * Scrolls to the first field with an error
	 */
	const scrollToFirstError = () => {
		const firstErrorField = Object.keys(errors)[0] as keyof T;
		if (firstErrorField) {
			const ref = fieldRefs.get(firstErrorField);
			if (ref) {
				ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
				// Focus the field if it's focusable
				if (ref instanceof HTMLElement && 'focus' in ref) {
					setTimeout(() => ref.focus(), 100);
				}
			}
		}
	};

	/**
	 * Registers a field ref for scrolling to errors
	 */
	const registerFieldRef = <K extends keyof T>(field: K, ref: HTMLElement | null) => {
		if (ref) {
			fieldRefs.set(field, ref);
		} else {
			fieldRefs.delete(field);
		}
	};

	/**
	 * Handles form submission
	 */
	const handleSubmit = async (e?: SubmitEvent) => {
		e?.preventDefault();
		isSubmitting = true;

		if (!validateForm()) {
			isSubmitting = false;
			// Scroll to first error after validation
			setTimeout(() => scrollToFirstError(), 0);
			return;
		}

		try {
			await onSubmit?.(values);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			isSubmitting = false;
		}
	};

	/**
	 * Resets the form to initial values
	 */
	const reset = () => {
		Object.keys(initialValues).forEach((key) => {
			values[key as keyof T] = initialValues[key as keyof T];
		});
		Object.keys(errors).forEach((key) => {
			delete errors[key as keyof T];
		});
		touched.clear();
		dirty.clear();
	};

	/**
	 * Resets only the error messages
	 */
	const resetErrors = () => {
		Object.keys(errors).forEach((key) => {
			delete errors[key as keyof T];
		});
	};

	/**
	 * Gets props for a field (useful for binding to inputs)
	 */
	const getFieldProps = <K extends keyof T>(field: K): FieldProps<T[K]> => {
		return {
			value: values[field],
			errorMessage: errors[field],
			fieldName: field as string,
			registerRef: registerFieldRef,
			onchange: (value: T[K]) => handleChange(field, value),
			onblur: () => handleBlur(field)
		};
	};

	return {
		get values() {
			return values;
		},
		get errors() {
			return errors;
		},
		get touched() {
			return touched;
		},
		get dirty() {
			return dirty;
		},
		get isSubmitting() {
			return isSubmitting;
		},
		get isValid() {
			return isValid;
		},
		get fieldRefs() {
			return fieldRefs;
		},
		setValue,
		setError,
		clearError,
		validateField,
		validateForm,
		handleBlur,
		handleChange,
		handleSubmit,
		scrollToFirstError,
		registerFieldRef,
		getFieldProps,
		reset,
		resetErrors
	};
}
