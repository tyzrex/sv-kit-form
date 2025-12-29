import type { FormConfig, FormState } from "./types";

/**
 * Create a form instance using Svelte 5 runes
 */
export function createForm<T extends Record<string, any>>(
  config: FormConfig<T>
) {
  let values = $state(config.initialValues);
  let errors = $state<Record<string, string>>({});
  let touched = $state<Record<string, boolean>>({});
  let isSubmitting = $state(false);

  const isValid = $derived(Object.keys(errors).length === 0);

  function setFieldValue(field: keyof T, value: any) {
    values = { ...values, [field]: value };
    validateField(field as string);
  }

  function setFieldTouched(field: keyof T, isTouched = true) {
    touched = { ...touched, [field]: isTouched };
  }

  function validateField(field: string) {
    if (config.validate) {
      const validationErrors = config.validate(values);
      if (validationErrors[field]) {
        errors = { ...errors, [field]: validationErrors[field] };
      } else {
        const { [field]: _, ...rest } = errors;
        errors = rest;
      }
    }
  }

  function validateForm() {
    if (config.validate) {
      errors = config.validate(values);
      return Object.keys(errors).length === 0;
    }
    return true;
  }

  async function handleSubmit(e?: Event) {
    e?.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    touched = allTouched;

    if (!validateForm()) {
      return;
    }

    isSubmitting = true;
    try {
      await config.onSubmit(values);
    } finally {
      isSubmitting = false;
    }
  }

  function reset() {
    values = config.initialValues;
    errors = {};
    touched = {};
    isSubmitting = false;
  }

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
    get isSubmitting() {
      return isSubmitting;
    },
    get isValid() {
      return isValid;
    },
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
  };
}
