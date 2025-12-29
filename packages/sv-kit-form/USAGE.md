# Usage Guide - sv-kit-form

Complete guide for using the sv-kit-form library.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Validation](#validation)
3. [Built-in Validators](#built-in-validators)
4. [Custom Validators](#custom-validators)
5. [Advanced Features](#advanced-features)
6. [API Reference](#api-reference)
7. [Examples](#examples)

## Basic Usage

### Simple Form

```svelte
<script lang="ts">
	import { createForm, validators } from 'sv-kit-form';

	interface FormData {
		name: string;
		email: string;
	}

	const form = createForm<FormData>({
		initialValues: {
			name: '',
			email: ''
		},
		validationSchema: {
			name: validators.required,
			email: [validators.required, validators.email]
		},
		onSubmit: async (values) => {
			console.log(values);
		}
	});
</script>

<form onsubmit={form.handleSubmit}>
	<input
		type="text"
		value={form.values.name}
		oninput={(e) => form.handleChange('name', e.currentTarget.value)}
		onblur={() => form.handleBlur('name')}
	/>
	{#if form.touched.has('name') && form.errors.name}
		<span>{form.errors.name}</span>
	{/if}

	<button type="submit" disabled={!form.isValid}> Submit </button>
</form>
```

## Validation

### Validation Schema

The `validationSchema` accepts validators for each field. You can use:

- **Single validator**: `field: validators.required`
- **Multiple validators**: `field: [validators.required, validators.email]`

```typescript
validationSchema: {
  name: validators.required,
  email: [validators.required, validators.email],
  age: [validators.required, validators.min(18)]
}
```

### Validation Timing

Control when validation happens:

```typescript
createForm({
	// ...
	validateOnChange: true, // Validate when field changes (default: true)
	validateOnBlur: true // Validate when field loses focus (default: true)
});
```

## Built-in Validators

### Text Validators

```typescript
// Required field
validators.required;

// Email format
validators.email;

// Alphabets only (includes spaces)
validators.alphabetsOnly;

// Minimum length
validators.minLength(5);

// Maximum length
validators.maxLength(100);

// URL format
validators.url;
```

### Number Validators

```typescript
// Valid number
validators.number;

// Minimum value
validators.min(0);

// Maximum value
validators.max(100);
```

### Special Validators

```typescript
// Phone number (10 digits)
validators.phone;

// Minimum age from date of birth
validators.age(18);

// Custom regex pattern
validators.pattern(/^[A-Z]+$/, 'Must be uppercase letters only');

// Match another field (password confirmation)
validators.matches('password', 'Passwords must match');
```

## Custom Validators

### Creating Custom Validators

Validators are functions that return `null` for valid values or an error message string:

```typescript
// Simple custom validator
const mustBeFoo = (value: string): string | null => {
	return value === 'foo' ? null : 'Value must be "foo"';
};

// Validator factory (with parameters)
const minWords =
	(count: number) =>
	(value: string): string | null => {
		const words = value.trim().split(/\s+/).length;
		return words >= count ? null : `Must have at least ${count} words`;
	};

// Using in schema
validationSchema: {
  field1: mustBeFoo,
  field2: minWords(3)
}
```

### Using validators.custom

```typescript
const customValidator = validators.custom<string>((value) => {
	if (value.includes('bad')) {
		return 'Value cannot contain "bad"';
	}
	return null;
});
```

### Field-dependent Validation

Access other form values in validators:

```typescript
const validateEndDate = (value: string, formData?: FormData): string | null => {
	if (!formData) return null;
	const start = new Date(formData.startDate);
	const end = new Date(value);
	return end > start ? null : 'End date must be after start date';
};
```

## Advanced Features

### Programmatic Field Updates

```typescript
// Set field value
form.setValue('email', 'user@example.com');

// Set error manually
form.setError('email', 'This email is already taken');

// Clear error
form.clearError('email');

// Validate specific field
const isValid = form.validateField('email');

// Validate entire form
const isFormValid = form.validateForm();
```

### Form State Management

```typescript
// Check if form is valid
if (form.isValid) {
	// All fields are valid
}

// Check if submitting
if (form.isSubmitting) {
	// Show loading state
}

// Check if field is touched
if (form.touched.has('email')) {
	// Field has been focused
}

// Check if field is dirty (modified)
if (form.dirty.has('email')) {
	// Field value has changed
}

// Reset form to initial values
form.reset();

// Reset only errors
form.resetErrors();
```

### Scroll to First Error

Automatically scroll to the first field with an error:

```typescript
const form = createForm({
	// ...
});

// Manual trigger
form.scrollToFirstError();

// Automatic on submit (already built-in)
form.handleSubmit();
```

To enable scrolling, register field refs:

```svelte
<input
	bind:this={(ref) => form.registerFieldRef('email', ref)}
	value={form.values.email}
	oninput={(e) => form.handleChange('email', e.currentTarget.value)}
/>
```

### Using getFieldProps

Simplify field binding with `getFieldProps`:

```svelte
<script>
	const emailProps = $derived(form.getFieldProps('email'));
</script>

<input type="email" bind:value={emailProps.value} onblur={emailProps.onblur} />
{#if emailProps.errorMessage}
	<span>{emailProps.errorMessage}</span>
{/if}
```

## API Reference

### createForm Options

```typescript
interface FormOptions<T> {
	initialValues: T; // Initial form values
	validationSchema?: ValidationSchema<T>; // Validation rules
	onSubmit?: (values: T) => void | Promise<void>; // Submit handler
	validateOnChange?: boolean; // Validate on change (default: true)
	validateOnBlur?: boolean; // Validate on blur (default: true)
}
```

### FormReturn

```typescript
interface FormReturn<T> {
	// State
	values: T; // Current form values
	errors: Partial<Record<keyof T, string>>; // Error messages
	touched: SvelteSet<keyof T>; // Touched fields
	dirty: SvelteSet<keyof T>; // Modified fields
	isSubmitting: boolean; // Submission state
	isValid: boolean; // Overall validity
	fieldRefs: SvelteMap<keyof T, HTMLElement | null>; // Field refs

	// Methods
	setValue: (field, value) => void;
	setError: (field, error) => void;
	clearError: (field) => void;
	validateField: (field) => boolean;
	validateForm: () => boolean;
	handleBlur: (field) => void;
	handleChange: (field, value) => void;
	handleSubmit: (e?: SubmitEvent) => Promise<void>;
	scrollToFirstError: () => void;
	registerFieldRef: (field, ref) => void;
	getFieldProps: (field) => FieldProps;
	reset: () => void;
	resetErrors: () => void;
}
```

## Examples

### Login Form

```svelte
<script lang="ts">
	import { createForm, validators } from 'sv-kit-form';

	interface LoginForm {
		email: string;
		password: string;
		remember: boolean;
	}

	const form = createForm<LoginForm>({
		initialValues: { email: '', password: '', remember: false },
		validationSchema: {
			email: [validators.required, validators.email],
			password: [validators.required, validators.minLength(8)]
		},
		onSubmit: async (values) => {
			await fetch('/api/login', {
				method: 'POST',
				body: JSON.stringify(values)
			});
		}
	});
</script>
```

### Multi-Step Form

```svelte
<script lang="ts">
	let step = $state(1);

	const form = createForm({
		initialValues: { step1Field: '', step2Field: '' },
		validationSchema: {
			step1Field: validators.required,
			step2Field: validators.required
		}
	});

	const nextStep = () => {
		if (step === 1 && form.validateField('step1Field')) {
			step = 2;
		}
	};
</script>

{#if step === 1}
	<!-- Step 1 fields -->
	<button onclick={nextStep}>Next</button>
{:else}
	<!-- Step 2 fields -->
	<button type="submit">Submit</button>
{/if}
```

### Dynamic Form Fields

```svelte
<script lang="ts">
	interface FormData {
		tags: string[];
	}

	const form = createForm<FormData>({
		initialValues: { tags: [''] },
		onSubmit: async (values) => {
			console.log(values);
		}
	});

	const addTag = () => {
		form.setValue('tags', [...form.values.tags, '']);
	};

	const updateTag = (index: number, value: string) => {
		const newTags = [...form.values.tags];
		newTags[index] = value;
		form.setValue('tags', newTags);
	};
</script>

{#each form.values.tags as tag, index}
	<input value={tag} oninput={(e) => updateTag(index, e.currentTarget.value)} />
{/each}
<button onclick={addTag}>Add Tag</button>
```

### Server-Side Validation

```svelte
<script lang="ts">
	const form = createForm({
		initialValues: { username: '' },
		validationSchema: {
			username: validators.required
		},
		onSubmit: async (values) => {
			try {
				const response = await fetch('/api/register', {
					method: 'POST',
					body: JSON.stringify(values)
				});

				if (!response.ok) {
					const errors = await response.json();
					// Set server errors
					if (errors.username) {
						form.setError('username', errors.username);
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	});
</script>
```

## Best Practices

1. **Type your forms**: Always provide TypeScript interfaces for type safety
2. **Combine validators**: Use arrays for multiple validation rules
3. **Custom error messages**: Provide clear, user-friendly error messages
4. **Loading states**: Use `isSubmitting` to show loading indicators
5. **Disable on invalid**: Disable submit button when `!form.isValid`
6. **Reset on success**: Call `form.reset()` after successful submission
7. **Server validation**: Set server errors with `form.setError()`
8. **Accessibility**: Add proper labels, ARIA attributes, and focus management

## Migration from Old API

If you're migrating from the old API:

### Before

```typescript
const form = createForm({
	initialValues: { email: '' },
	validate: (values) => {
		const errors = {};
		if (!values.email) errors.email = 'Required';
		return errors;
	}
});

form.setFieldValue('email', 'test@example.com');
form.setFieldTouched('email');
```

### After

```typescript
const form = createForm({
	initialValues: { email: '' },
	validationSchema: {
		email: validators.required
	}
});

form.handleChange('email', 'test@example.com');
form.handleBlur('email');
```

## Tips

- Use `$derived` for computed field properties
- Destructure validators for cleaner code
- Create custom validator factories for reusable logic
- Use `SvelteSet` methods: `has()`, `add()`, `clear()`
- Leverage TypeScript inference for better DX
