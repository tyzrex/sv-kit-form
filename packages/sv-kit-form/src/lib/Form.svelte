<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onSubmit: (e: SubmitEvent) => void | Promise<void>;
		children: Snippet;
		class?: string;
	}

	let { onSubmit, children, class: className = '' }: Props = $props();
</script>

<form onsubmit={onSubmit} class={className}>
	{@render children()}
</form>
