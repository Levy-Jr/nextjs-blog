"use client"

import { Comment } from "@prisma/client"
import { useEffect, useState } from "react";
import CommentAdmin from "./commentAdmin";

type CommentClientProps = {
  isCommentOwner: boolean;
  userName: Promise<string | null>;
  comment: Comment;
}

const CommentList = ({ isCommentOwner, comment, userName }: CommentClientProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <li
        key={comment.id}
        className="flex flex-col md:flex-row justify-between"
      >
        <div>
          <div>
            <span className="font-bold">{userName}</span>
          </div>
          <p>{comment.text}</p>
        </div>
        {isCommentOwner &&
          <CommentAdmin
            comment={comment}
          />
        }
      </li>
    </>
  )
}

export default CommentList