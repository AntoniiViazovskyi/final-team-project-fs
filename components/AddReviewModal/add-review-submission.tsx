'use client'

import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { AddReviewModal } from './add-review-modal'
import type { AddReviewFormValues } from '@/components/AddReviewForm/add-review-form-schema'

type AddReviewSubmissionProps = {
  locationId: string
  onClose: () => void
}

export function AddReviewSubmission({
  locationId,
  onClose,
}: AddReviewSubmissionProps) {
  const pending = useRef(false)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const close = useCallback(() => {
    mounted.current = false
    onClose()
  }, [onClose])

  async function submit(values: AddReviewFormValues) {
    if (pending.current) return
    pending.current = true
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ ...values, locationId }),
      })
      const result: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const message =
          response.status === 401
            ? 'Увійдіть у свій акаунт, щоб надіслати відгук.'
            : response.status === 404
              ? 'Цю локацію не знайдено.'
              : response.status === 422
                ? 'Перевірте ім’я у своєму профілі.'
                : 'Не вдалося надіслати відгук. Спробуйте ще раз.'
        throw new Error(message)
      }
      if (
        response.status !== 201 ||
        !result ||
        typeof result !== 'object' ||
        !('data' in result) ||
        !result.data ||
        typeof result.data !== 'object' ||
        !('_id' in result.data) ||
        typeof result.data._id !== 'string' ||
        !/^[a-f\d]{24}$/i.test(result.data._id)
      ) {
        throw new Error('Не вдалося підтвердити збереження відгуку.')
      }
      toast.success('Ваш відгук надіслано на модерацію.')
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'TimeoutError'
          ? 'Сервер не відповів вчасно. Спробуйте ще раз.'
          : error instanceof TypeError
            ? 'Не вдалося надіслати відгук. Перевірте з’єднання.'
            : error instanceof Error
              ? error.message
              : 'Не вдалося надіслати відгук. Спробуйте ще раз.'
      toast.error(message)
      throw new Error(message)
    } finally {
      pending.current = false
    }
  }

  return (
    <AddReviewModal
      onClose={close}
      onSubmit={submit}
      onSuccess={() => {
        if (mounted.current) close()
      }}
    />
  )
}
