<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onSubmit: (e: Event) => void;
		children: Snippet;
		class?: string;
	}

	let { onSubmit, children, class: className = '' }: Props = $props();
</script>

<form onsubmit={onSubmit} class={className}>
	{@render children()}
</form>
