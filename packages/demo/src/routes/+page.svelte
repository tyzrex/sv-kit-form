<script lang="ts">
	import { createForm, Form } from 'sv-kit-form';

	interface LoginForm {
		email: string;
		password: string;
		remember: boolean;
	}

	const loginForm = createForm<LoginForm>({
		initialValues: {
			email: '',
			password: '',
			remember: false
		},
		validate: (values) => {
			const errors: Record<string, string> = {};

			if (!values.email) {
				errors.email = 'Email is required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}

			if (!values.password) {
				errors.password = 'Password is required';
			} else if (values.password.length < 6) {
				errors.password = 'Password must be at least 6 characters';
			}

			return errors;
		},
		onSubmit: async (values) => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert(`Login successful!\n${JSON.stringify(values, null, 2)}`);
		}
	});

	interface SignupForm {
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}

	const signupForm = createForm<SignupForm>({
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		validate: (values) => {
			const errors: Record<string, string> = {};

			if (!values.username) {
				errors.username = 'Username is required';
			} else if (values.username.length < 3) {
				errors.username = 'Username must be at least 3 characters';
			}

			if (!values.email) {
				errors.email = 'Email is required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}

			if (!values.password) {
				errors.password = 'Password is required';
			} else if (values.password.length < 8) {
				errors.password = 'Password must be at least 8 characters';
			}

			if (!values.confirmPassword) {
				errors.confirmPassword = 'Please confirm your password';
			} else if (values.password !== values.confirmPassword) {
				errors.confirmPassword = 'Passwords do not match';
			}

			return errors;
		},
		onSubmit: async (values) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert(`Signup successful!\n${JSON.stringify(values, null, 2)}`);
			signupForm.reset();
		}
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<h1 class="text-4xl font-bold mb-2 text-center">sv-kit-form Demo</h1>
	<p class="text-gray-600 text-center mb-8">
		A lightweight form library for SvelteKit built with Svelte 5 runes
	</p>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Login Form -->
		<div class="bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-semibold mb-4">Login Form</h2>
			<Form onSubmit={loginForm.handleSubmit} class="space-y-4">
				<div>
					<label for="login-email" class="block text-sm font-medium mb-1">Email</label>
					<input
						id="login-email"
						type="email"
						value={loginForm.values.email}
						oninput={(e) => loginForm.setFieldValue('email', e.currentTarget.value)}
						onblur={() => loginForm.setFieldTouched('email')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						class:border-red-500={loginForm.touched.email && loginForm.errors.email}
					/>
					{#if loginForm.touched.email && loginForm.errors.email}
						<p class="text-red-500 text-sm mt-1">{loginForm.errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="login-password" class="block text-sm font-medium mb-1">Password</label>
					<input
						id="login-password"
						type="password"
						value={loginForm.values.password}
						oninput={(e) => loginForm.setFieldValue('password', e.currentTarget.value)}
						onblur={() => loginForm.setFieldTouched('password')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						class:border-red-500={loginForm.touched.password && loginForm.errors.password}
					/>
					{#if loginForm.touched.password && loginForm.errors.password}
						<p class="text-red-500 text-sm mt-1">{loginForm.errors.password}</p>
					{/if}
				</div>

				<div class="flex items-center">
					<input
						id="remember"
						type="checkbox"
						checked={loginForm.values.remember}
						onchange={(e) => loginForm.setFieldValue('remember', e.currentTarget.checked)}
						class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<label for="remember" class="ml-2 block text-sm">Remember me</label>
				</div>

				<button
					type="submit"
					disabled={loginForm.isSubmitting || !loginForm.isValid}
					class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
				>
					{loginForm.isSubmitting ? 'Logging in...' : 'Login'}
				</button>
			</Form>

			<div class="mt-4 p-3 bg-gray-50 rounded">
				<p class="text-xs font-semibold mb-1">Form State:</p>
				<pre class="text-xs text-gray-700">Valid: {loginForm.isValid}
Submitting: {loginForm.isSubmitting}</pre>
			</div>
		</div>

		<!-- Signup Form -->
		<div class="bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-2xl font-semibold mb-4">Signup Form</h2>
			<Form onSubmit={signupForm.handleSubmit} class="space-y-4">
				<div>
					<label for="signup-username" class="block text-sm font-medium mb-1">Username</label>
					<input
						id="signup-username"
						type="text"
						value={signupForm.values.username}
						oninput={(e) => signupForm.setFieldValue('username', e.currentTarget.value)}
						onblur={() => signupForm.setFieldTouched('username')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						class:border-red-500={signupForm.touched.username && signupForm.errors.username}
					/>
					{#if signupForm.touched.username && signupForm.errors.username}
						<p class="text-red-500 text-sm mt-1">{signupForm.errors.username}</p>
					{/if}
				</div>

				<div>
					<label for="signup-email" class="block text-sm font-medium mb-1">Email</label>
					<input
						id="signup-email"
						type="email"
						value={signupForm.values.email}
						oninput={(e) => signupForm.setFieldValue('email', e.currentTarget.value)}
						onblur={() => signupForm.setFieldTouched('email')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						class:border-red-500={signupForm.touched.email && signupForm.errors.email}
					/>
					{#if signupForm.touched.email && signupForm.errors.email}
						<p class="text-red-500 text-sm mt-1">{signupForm.errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="signup-password" class="block text-sm font-medium mb-1">Password</label>
					<input
						id="signup-password"
						type="password"
						value={signupForm.values.password}
						oninput={(e) => signupForm.setFieldValue('password', e.currentTarget.value)}
						onblur={() => signupForm.setFieldTouched('password')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						class:border-red-500={signupForm.touched.password && signupForm.errors.password}
					/>
					{#if signupForm.touched.password && signupForm.errors.password}
						<p class="text-red-500 text-sm mt-1">{signupForm.errors.password}</p>
					{/if}
				</div>

				<div>
					<label for="signup-confirm" class="block text-sm font-medium mb-1">Confirm Password</label
					>
					<input
						id="signup-confirm"
						type="password"
						value={signupForm.values.confirmPassword}
						oninput={(e) => signupForm.setFieldValue('confirmPassword', e.currentTarget.value)}
						onblur={() => signupForm.setFieldTouched('confirmPassword')}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						class:border-red-500={signupForm.touched.confirmPassword &&
							signupForm.errors.confirmPassword}
					/>
					{#if signupForm.touched.confirmPassword && signupForm.errors.confirmPassword}
						<p class="text-red-500 text-sm mt-1">{signupForm.errors.confirmPassword}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={signupForm.isSubmitting || !signupForm.isValid}
					class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
				>
					{signupForm.isSubmitting ? 'Creating Account...' : 'Sign Up'}
				</button>
			</Form>

			<div class="mt-4 p-3 bg-gray-50 rounded">
				<p class="text-xs font-semibold mb-1">Form State:</p>
				<pre class="text-xs text-gray-700">Valid: {signupForm.isValid}
Submitting: {signupForm.isSubmitting}</pre>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="mt-12 bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
		<h2 class="text-2xl font-bold mb-4">Features</h2>
		<div class="grid md:grid-cols-2 gap-4">
			<div class="flex items-start">
				<span class="text-2xl mr-3">🚀</span>
				<div>
					<h3 class="font-semibold">Built with Svelte 5 Runes</h3>
					<p class="text-sm text-gray-600">Uses modern Svelte 5 runes for reactive state</p>
				</div>
			</div>
			<div class="flex items-start">
				<span class="text-2xl mr-3">📝</span>
				<div>
					<h3 class="font-semibold">Simple Validation</h3>
					<p class="text-sm text-gray-600">Easy-to-use validation with custom error messages</p>
				</div>
			</div>
			<div class="flex items-start">
				<span class="text-2xl mr-3">🎯</span>
				<div>
					<h3 class="font-semibold">TypeScript Support</h3>
					<p class="text-sm text-gray-600">Full type safety for your forms</p>
				</div>
			</div>
			<div class="flex items-start">
				<span class="text-2xl mr-3">⚡</span>
				<div>
					<h3 class="font-semibold">Zero Dependencies</h3>
					<p class="text-sm text-gray-600">Only requires Svelte - no bloat</p>
				</div>
			</div>
		</div>
	</div>
</div>
