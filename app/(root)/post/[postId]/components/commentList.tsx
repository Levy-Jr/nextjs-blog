"use client"

import { Comment } from "@prisma/client"
import { useEffect, useState } from "react";

type CommentClientProps = {
  userName: Promise<string | null>;
  comment: Comment;
}

const CommentList = ({ comment, userName }: CommentClientProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onEdit = () => {

  }

  const onDelete = () => {

  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <ul className="my-8 space-y-6">
      <li
        key={comment.id}
        className="flex justify-between"
      >
        <div>
          <div>
            <span className="font-bold">{userName}</span>
          </div>
          <p>{comment.text}</p>
        </div>
      </li>
    </ul>
  )
}

export default CommentList