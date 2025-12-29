# sv-kit-form

A lightweight form library for SvelteKit built with Svelte 5 runes.

## Features

- 🚀 Built with Svelte 5 runes for reactive state management
- 📝 Simple form validation
- 🎯 TypeScript support
- ⚡ Zero dependencies (except Svelte)
- 🎨 Unstyled - bring your own styles

## Installation

```bash
pnpm add sv-kit-form
```

## Usage

```svelte
<script lang="ts">
	import { createForm, Form } from 'sv-kit-form';

	const form = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		validate: (values) => {
			const errors: Record<string, string> = {};
			if (!values.email) errors.email = 'Email is required';
			if (!values.password) errors.password = 'Password is required';
			return errors;
		},
		onSubmit: async (values) => {
			console.log('Form submitted:', values);
		}
	});
</script>

<Form onSubmit={form.handleSubmit}>
	<input
		type="email"
		value={form.values.email}
		oninput={(e) => form.setFieldValue('email', e.currentTarget.value)}
		onblur={() => form.setFieldTouched('email')}
	/>
	{#if form.touched.email && form.errors.email}
		<span>{form.errors.email}</span>
	{/if}

	<button type="submit" disabled={form.isSubmitting}>
		Submit
	</button>
</Form>
```

## License

MIT
