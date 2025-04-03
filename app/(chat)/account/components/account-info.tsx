'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserPen } from 'lucide-react'
import { getUserSession } from '../_actions/get_user'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'

export default function AccountInfo({ user }: { user: User }) {
  const [originalName, setOriginalName] = useState(user?.username)
  const [name, setName] = useState(originalName)
  const [email, setEmail] = useState(user?.email)

  const [isEditing, setIsEditing] = useState(false)

  const [avatar, setAvatar] = useState('/placeholder.svg?height=100&width=100')

  useEffect(() => {
    if (name !== originalName) {
      setIsEditing(true)
    }
  }, [name])

  // useEffect(() => {
  //   const retrieveUser = async () => {
  //     const user = session.user
  //     setUser(user)
  //     setEmail(user.email)
  //     setOriginalName(user.username)
  //     setName(user.username)
  //   }

  //   retrieveUser()
  // }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value)

  // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setAvatar(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated info to your backend
    console.log('Updated info:', { name, email, avatar })
    await update({ username: name })
    setIsEditing(false)

    window.location.reload()
  }

  return (
    <>
      {user && (
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle className="flex gap-x-3">
              <UserPen />
              Informações do perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-start space-y-4 justify-start col-span-2 pb-4">
                {/* <Label>Avatar</Label>
                <Avatar
                  // className={`${
                  //   isEditing ? 'h-20 w-20 ring-1 ring-primary' : 'h-20 w-20'
                  // } `}
                  className="h-20 w-20"
                >
                  <AvatarImage
                    className="object-cover object-center"
                    src={avatar}
                    alt={name}
                  />
                  <AvatarFallback>
                    {name ? name
                      .split(' ')
                      .map((n) => n[0])
                      .join('') : 'A'}
                  </AvatarFallback>
                </Avatar> */}
                {/* {isEditing && (
              <Label htmlFor="avatar" className="cursor-pointer">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                  Mudar foto
                </span>
              </Label>
            )} */}
              </div>
              <div className="col-span-2 space-y-4 ">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>

                  <Input
                    className={`${isEditing ? 'border-primary' : ''}`}
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <div className="flex gap-x-3">
                    <Input
                      // className={`${isEditing ? 'border-primary' : ''}`}
                      disabled
                      id="email"
                      type="email"
                      value={email as string}
                      onChange={handleEmailChange}
                    />
                    <Button disabled className="rounded-full">
                      Editar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="flex gap-x-3">
                    <Input
                      disabled
                      id="password"
                      type="password"
                      value={'asnfijansiugbnuiasgbusagi'}
                    />
                    <Button disabled className="rounded-full">
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            {/* <SecuritySettings /> */}
          </CardContent>
          <CardFooter>
            {isEditing && (
              <>
                <Button type="submit" onClick={handleSubmit} className="mr-2">
                  Salvar alterações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setName(originalName)
                    setIsEditing(false)
                  }}
                >
                  Cancelar
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  )
}
