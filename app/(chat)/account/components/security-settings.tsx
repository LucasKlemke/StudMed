'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SecuritySettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    // Here you would typically send the password change request to your backend
    console.log('Password change requested')
    // Reset form and exit edit mode
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsEditing(false)
  }

  return (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        ) : (
          <p>
            Your password was last changed on: <strong>May 1, 2023</strong>
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <>
            <Button type="submit" onClick={handleSubmit} className="mr-2">
              Mudar Senha
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Change Password</Button>
        )}
      </CardFooter>
    </Card>
  )
}
