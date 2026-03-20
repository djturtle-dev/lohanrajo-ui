'use server'

export async function submitFeedback(formData: FormData) {
  // Feedback module removed. This action is now a placeholder.
  console.log('Feedback submitted (UI only):', Object.fromEntries(formData.entries()));
  return { success: true };
}
