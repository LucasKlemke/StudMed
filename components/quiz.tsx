'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReward } from 'react-rewards'
import {
  Check,
  X,
  RotateCcw,
  Clock,
  Trophy,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  question: string
  options: string[]
  correct: string
}

interface QuizProps {
  result: {
    quiz: {
      questions: Question[]
      title?: string
    }
  }
  timed?: boolean
  timeLimit?: number
}

const QuizForm = ({ result, timed = false, timeLimit = 300 }: QuizProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [quizResult, setQuizResult] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const { reward, isAnimating } = useReward('rewardId', 'confetti', {
    elementCount: 100,
    spread: 120,
  })

  const questions = result.quiz.questions
  const totalQuestions = questions.length
  const progress = (Object.keys(answers).length / totalQuestions) * 100
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (timed && !submitted && !quizResult) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit(new Event('submit') as any)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timed, submitted, quizResult])

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
    const scorePercentage = (score / totalQuestions) * 100
    if (scorePercentage === 100) {
      reward()
    }
    setQuizResult(
      `${scorePercentage === 100 ? `Parabéns! ` : ``}Você acertou ${score} de ${
        totalQuestions
      } questões. ${scorePercentage}%`,
    )
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const resetQuiz = () => {
    setQuizResult(null)
    setAnswers({})
    setSubmitted(false)
    setCurrentQuestionIndex(0)
    setTimeRemaining(timeLimit)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (quizResult) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader
          className={`${quizResult?.includes('Parabéns') ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-t-lg`}
        >
          <CardTitle className="flex items-center gap-2">
            {quizResult?.includes('Parabéns') ? (
              <Trophy className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
            Resultado do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="text-xl font-medium text-center">{quizResult}</div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-lg border-b pb-2">
              Respostas Corretas:
            </h3>
            <div className="space-y-3">
              {questions.map((q: Question, idx: number) => {
                const isCorrect = answers[q.id] === q.correct
                return (
                  <div key={q.id} className="p-3 rounded-lg border">
                    <div className="flex items-start gap-2">
                      <div
                        className={`flex-shrink-0 rounded-full p-1 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                      >
                        {isCorrect ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <X className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{`${idx + 1}. ${q.question}`}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sua resposta:{' '}
                          <span
                            className={
                              isCorrect
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {answers[q.id] || 'Não respondida'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            Resposta correta: {q.correct}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={resetQuiz} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Refazer Quiz
          </Button>
        </CardFooter>
        <span
          id="rewardId"
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2"
        />
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{result.quiz.title || 'Quiz'}</CardTitle>
          {timed && (
            <div
              className={`flex items-center gap-2 font-mono text-lg ${timeRemaining < 30 ? 'text-red-500 animate-pulse' : ''}`}
            >
              <Clock className="h-5 w-5" />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Questão {currentQuestionIndex + 1} de {totalQuestions}
            </span>
            <span>{Object.keys(answers).length} respondidas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Label className="block font-semibold text-lg">
                {`${currentQuestionIndex + 1}. ${currentQuestion.question}`}
              </Label>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) =>
                  handleAnswerChange(currentQuestion.id, value)
                }
                className="flex flex-col space-y-3"
              >
                {currentQuestion.options.map((option, index: number) => {
                  const isSelected = answers[currentQuestion.id] === option
                  const isCorrect =
                    submitted && option === currentQuestion.correct
                  const isIncorrect =
                    submitted &&
                    isSelected &&
                    option !== currentQuestion.correct

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-input'
                      } ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
                      ${isIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`question-${currentQuestion.id}-option-${index}`}
                        className={`${isCorrect ? 'text-green-500' : ''} ${isIncorrect ? 'text-red-500' : ''}`}
                      />
                      <Label
                        htmlFor={`question-${currentQuestion.id}-option-${index}`}
                        className={`w-full cursor-pointer ${isCorrect ? 'text-green-700 dark:text-green-300' : ''} 
                        ${isIncorrect ? 'text-red-700 dark:text-red-300' : ''}`}
                      >
                        {option}
                      </Label>
                      {submitted && (
                        <div className="ml-auto">
                          {isCorrect && (
                            <Check className="h-5 w-5 text-green-500" />
                          )}
                          {isIncorrect && (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-6">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={nextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Próxima <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < totalQuestions}
          className="gap-2"
        >
          Finalizar Quiz <Check className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default QuizForm
