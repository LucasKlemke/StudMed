// AnatomyQuizForm.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReward } from 'react-rewards'

interface Question {
  id: number
  question: string
  options: string[]
  correct: string
}

const AnatomyQuizForm = ({ result }: { result: any }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [quizResult, setQuizResult] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const { reward, isAnimating } = useReward('rewardId', 'confetti')

  const questions = result.quiz.questions

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    let score = 0
    questions.forEach((q: Question) => {
      if (answers[q.id] === q.correct) {
        score++
      }
    })
    const scorePercentage = (score / questions.length) * 100

    if (scorePercentage === 100) {
      reward()
    }

    setQuizResult(
      `${scorePercentage == 100 ? `Parabéns ! ` : ``}Você acertou ${score} de ${
        questions.length
      } questões. ${scorePercentage}%`
    )
  }

  return (
    <div className="pb-4 no-scroll">
      <form onSubmit={handleSubmit}>
        {questions?.map((q: Question, idx: number) => (
          <div key={q.id} className="mb-6">
            <Label className="block mb-2 font-semibold text-lg">
              {/* {` ${{idx}-{q.question}}`} */}
              {`${idx + 1}- ${q.question}`}
            </Label>
            <RadioGroup
              value={answers[q.id] || ''}
              onValueChange={(value) => handleAnswerChange(q.id, value)}
              className="flex flex-col space-y-2"
            >
              {q.options.map((option, index: number) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    submitted &&
                    answers[q.id] === option &&
                    option !== q.correct &&
                    'text-destructive dark:text-red-500'
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`question-${q.id}-option-${index}`}
                  />
                  <Label htmlFor={`question-${q.id}-option-${index}`}>
                    {option}
                  </Label>
                  {/* {submitted && option !== q.correct ? (
                   <X className='text-destructive'/>
                  ) : <Check className='text-primary'/>} */}
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button type="submit">Enviar</Button>
      </form>

      {quizResult && (
        <div
          className={`mt-6 p-4 space-y-4 rounded ${
            quizResult?.includes('Parabéns') ?
            'bg-yellow-500' : 'bg-primary'
          }  text-primary-foreground`}
        >
          <p> {quizResult}</p>
          <div>
            <strong>Respostas:</strong>
            {questions.map((q: Question, idx: number) => {
              return (
                <p key={q.id}>
                  {/* {` ${{idx}-{q.question}}`} */}
                  {`${idx + 1}- ${q.question}`} - <strong>{q.correct}</strong>
                </p>
              )
            })}
          </div>
        </div>
      )}
      <span id="rewardId" />
    </div>
  )
}

export default AnatomyQuizForm
