'use client'

import { useId, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Oval } from 'react-loader-spinner'

import styles from './add-review-form.module.css'
import {
  addReviewSchema,
  type AddReviewFormValues,
} from './add-review-form-schema'

type AddReviewFormProps = {
  onCancel: () => void
  onSubmit: (values: AddReviewFormValues) => Promise<void> | void
  onSuccess?: () => void
}

type RatingFieldProps = {
  disabled: boolean
  errorId: string
  groupId: string
  value: number
  onBlur: () => void
  onChange: (rate: number) => void
}

const RATING_VALUES = [1, 2, 3, 4, 5]

function RatingField({
  disabled,
  errorId,
  groupId,
  value,
  onBlur,
  onChange,
}: RatingFieldProps) {
  const [previewRate, setPreviewRate] = useState<number | null>(null)
  const activeRate = disabled ? value : (previewRate ?? value)

  return (
    <div
      className={styles.ratingOptions}
      onMouseLeave={() => setPreviewRate(null)}
    >
      {RATING_VALUES.map((rate) => {
        return (
          <label
            className={`${styles.ratingOption} ${
              disabled ? styles.ratingOptionDisabled : ''
            }`}
            htmlFor={`${groupId}-${rate}`}
            key={rate}
            onMouseEnter={() => {
              if (!disabled) setPreviewRate(rate)
            }}
          >
            <input
              className={styles.ratingInput}
              id={`${groupId}-${rate}`}
              name="rate"
              type="radio"
              value={rate}
              checked={value === rate}
              disabled={disabled}
              aria-describedby={errorId}
              aria-label={`Оцінка ${rate} з 5`}
              onBlur={() => {
                setPreviewRate(null)
                onBlur()
              }}
              onChange={() => onChange(rate)}
              onFocus={() => setPreviewRate(rate)}
            />
            <svg
              className={styles.star}
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use
                href={`/icons/sprite.svg#${rate <= activeRate ? 'icon-star-filled' : 'icon-star-rate'}`}
              />
            </svg>
          </label>
        )
      })}
    </div>
  )
}

export function AddReviewForm({ onCancel, onSubmit, onSuccess }: AddReviewFormProps) {
  const descriptionId = useId()
  const descriptionErrorId = `${descriptionId}-error`
  const ratingGroupId = useId()
  const ratingErrorId = useId()

  return (
    <Formik<AddReviewFormValues>
      initialValues={{ rate: 0, description: '' }}
      validationSchema={addReviewSchema}
      onSubmit={async (values, { resetForm, setStatus }) => {
        setStatus(undefined)
        try {
          await onSubmit({ ...values, description: values.description.trim() })
        } catch (error) {
          setStatus(
            error instanceof Error
              ? error.message
              : 'Не вдалося надіслати відгук. Спробуйте ще раз.',
          )
          return
        }
        resetForm()
        onSuccess?.()
      }}
    >
      {({
        errors,
        isSubmitting,
        setFieldTouched,
        setFieldValue,
        status,
        touched,
        values,
      }) => (
        <Form className={styles.form} noValidate aria-busy={isSubmitting}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={descriptionId}>
              Ваш відгук
            </label>
            <Field
              as="textarea"
              className={styles.textarea}
              id={descriptionId}
              name="description"
              placeholder="Напишіть ваш відгук"
              rows={6}
              disabled={isSubmitting}
              aria-describedby={descriptionErrorId}
              aria-invalid={Boolean(touched.description && errors.description)}
            />
            <p
              className={styles.error}
              id={descriptionErrorId}
              aria-live="polite"
            >
              {touched.description ? errors.description : ''}
            </p>
          </div>

          <fieldset
            className={styles.ratingGroup}
            aria-describedby={ratingErrorId}
            aria-invalid={Boolean(touched.rate && errors.rate)}
          >
            <legend className={styles.label}>Ваша оцінка</legend>

            <RatingField
              disabled={isSubmitting}
              errorId={ratingErrorId}
              groupId={ratingGroupId}
              value={values.rate}
              onBlur={() => void setFieldTouched('rate', true)}
              onChange={(rate) => void setFieldValue('rate', rate)}
            />
            <p className={styles.error} id={ratingErrorId} aria-live="polite">
              {touched.rate ? errors.rate : ''}
            </p>
          </fieldset>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onCancel}
            >
              Відмінити
            </button>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className={styles.loader}>
                  <Oval
                    width={18}
                    height={18}
                    color="currentColor"
                    secondaryColor="currentColor"
                    strokeWidth={5}
                    ariaLabel="Надсилання відгуку"
                  />
                </span>
              )}
              Надіслати
            </button>
          </div>
          {typeof status === 'string' && (
            <p className={styles.error} role="alert">
              {status}
            </p>
          )}
        </Form>
      )}
    </Formik>
  )
}
