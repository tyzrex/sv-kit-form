# sv-kit-form

A powerful, type-safe form validation library for SvelteKit built with Svelte 5 runes. **Designed to be copied into your projects** for full control and customization.

## ✨ Features

- 🚀 Built with Svelte 5 runes (`$state`, `$derived`, `SvelteSet`, `SvelteMap`)
- 📝 15+ built-in validators (required, email, minLength, phone, etc.)
- 🎯 Full TypeScript support with strong type inference
- 🔄 Automatic error clearing on field changes
- 📍 Scroll to first error on submission
- ⚡ Zero runtime dependencies (except Svelte)
- 🎨 Unstyled - bring your own design
- 🛠️ Easy to customize and extend

## 🚀 Quick Start

### Copy to Your Project

```bash
# Copy the entire library to your project

cp -r packages/sv-kit-form/src/lib your-project/src/lib/sv-kit-form


```

### Basic Usage

```typescript
import { createForm, validators } from 'sv-kit-form';

interface LoginForm {
	email: string;
	password: string;
}

const form = createForm<LoginForm>({
	initialValues: { email: '', password: '' },
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
```

```svelte
<form onsubmit={form.handleSubmit}>
	<input
		type="email"
		value={form.values.email}
		oninput={(e) => form.handleChange('email', e.currentTarget.value)}
		onblur={() => form.handleBlur('email')}
	/>
	{#if form.touched.has('email') && form.errors.email}
		<span class="error">{form.errors.email}</span>
	{/if}

	​
	<button type="submit" disabled={!form.isValid || form.isSubmitting}>
		​ {form.isSubmitting ? 'Submitting...' : 'Submit'}
		​
	</button>
</form>
```

## 📚 Built-in Validators

| Validator                      | Description               |
| ------------------------------ | ------------------------- |
| `validators.required`          | Field must have value     |
| `validators.email`             | Valid email format        |
| `validators.alphabetsOnly`     | Only alphabets and spaces |
| `validators.minLength(n)`      | Minimum string length     |
| `validators.maxLength(n)`      | Maximum string length     |
| `validators.phone`             | 10-digit phone number     |
| `validators.age(minAge)`       | Minimum age from DOB      |
| `validators.url`               | Valid URL                 |
| `validators.number`            | Must be a number          |
| `validators.min(n)`            | Minimum numeric value     |
| `validators.max(n)`            | Maximum numeric value     |
| `validators.pattern(rx, msg)`  | Custom regex              |
| `validators.matches(fld, msg)` | Match another field       |
| `validators.custom(fn)`        | Custom validator          |

## 🎯 Form API

### State (Getters)

```typescript
form.values; // Current form values
form.errors; // Error messages
form.touched; // SvelteSet of touched fields
form.dirty; // SvelteSet of modified fields
form.isSubmitting; // Submission state
form.isValid; // Overall validity
form.fieldRefs; // SvelteMap of field refs
```

### Methods

```typescript
form.setValue(field, value); // Set field value
form.setError(field, error); // Set error
form.clearError(field); // Clear error
form.validateField(field); // Validate single field
form.validateForm(); // Validate all fields
form.handleBlur(field); // Handle blur event
form.handleChange(field, value); // Handle change event
form.handleSubmit(e); // Handle form submission
form.scrollToFirstError(); // Scroll to first error
form.registerFieldRef(field, ref); // Register field ref
form.getFieldProps(field); // Get field binding props
form.reset(); // Reset form to initial values
form.resetErrors(); // Reset only errors
```

## 🛠️ Development

### Project Structure

```
svelte-form/
├── packages/
│ ├── sv-kit-form/ # Core form library
│ │ ├── src/lib/
│ │ │ ├── createForm.svelte.ts
│ │ │ ├── validators/index.ts
│ │ │ ├── types.ts
│ │ │ └── Form.svelte
│ │ └── README.md
│ └── demo/ # Demo app
└── pnpm-workspace.yaml
```

### Commands

```bash
#Install dependencies

pnpm install

# Run demo app

pnpm dev

# Build library

cd packages/sv-kit-form && pnpm build

# Format code

pnpm format

# Check formatting

pnpm format:check
```

### Code Quality

- **ESLint 9.39.2**: Flat config with TypeScript and Svelte support
- **Prettier 3.7.4**: Tabs, single quotes, 100 width
- **Husky**: Pre-commit hooks for auto-formatting
- **lint-staged**: Only formats staged files

## 📖 Documentation

- **Detailed Usage Guide**: [packages/sv-kit-form/USAGE.md](packages/sv-kit-form/USAGE.md)
- **Library Documentation**: [packages/sv-kit-form/README.md](packages/sv-kit-form/README.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Demo**: http://localhost:5173 (run `pnpm dev`)

## 💡 Custom Validators

```typescript
// Simple validator
const mustBeFoo = (value: string): string | null => {
	return value === 'foo' ? null : 'Must be "foo"';
};

// Validator with parameters
const minWords =
	(count: number) =>
	(value: string): string | null => {
		const words = value.trim().split(/\s+/).length;
		return words >= count ? null : `At least ${count} words required`;
	};

// Field-dependent validator
const afterStartDate = (value: string, formData?: Form): string | null => {
	if (!formData) return null;
	return new Date(value) > new Date(formData.startDate) ? null : 'Must be after start date';
};
```

## 🎨 Why Copy Instead of Install?

- ✅ Full ownership and control over the code
- ✅ Easy customization for project-specific needs
- ✅ No dependency management
- ✅ Direct access to modify validators and behavior
- ✅ No version conflicts
- ✅ Copy only what you need
