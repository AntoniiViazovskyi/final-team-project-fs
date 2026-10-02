'use client'

import { useEffect, useId, useRef, useState } from 'react'

import Modal from '@/components/Modal/Modal'
import { AddReviewForm } from '@/components/AddReviewForm/add-review-form'
import type { AddReviewFormValues } from '@/components/AddReviewForm/add-review-form-schema'

import styles from './add-review-modal.module.css'

type AddReviewModalProps = {
  onClose: () => void
  onSubmit: (values: AddReviewFormValues) => Promise<void> | void
  onSuccess?: () => void
}

export function AddReviewModal({ onClose, onSubmit, onSuccess }: AddReviewModalProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const previousFocus = document.activeElement
    const dialog = titleRef.current?.closest('[role="dialog"]')
    dialog?.setAttribute('aria-labelledby', titleId)
    titleRef.current?.focus()

    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [mounted, titleId])

  if (!mounted) return null

  return (
    <Modal onClose={onClose}>
      <h2 className={styles.title} id={titleId} ref={titleRef} tabIndex={-1}>
        Залишити відгук
      </h2>
      <AddReviewForm onCancel={onClose} onSubmit={onSubmit} onSuccess={onSuccess} />
    </Modal>
  )
}
