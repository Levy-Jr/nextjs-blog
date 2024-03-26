import { checkRole } from "@/utils/roles"
import { UserButton, auth } from "@clerk/nextjs"
import Link from "next/link"

const Navbar = () => {
  const { userId } = auth()

  return (
    <header className="border-b">
      <nav className="flex justify-between h-16 items-center px-4">
        <div className="space-x-4">
          <Link href="/" className="text-lg">Início</Link>

        </div>
        {!userId &&
          <div className="space-x-10">
            <Link href="/sign-in">Login</Link>
            <Link href="/sign-up">Registrar</Link>
          </div>
        }
        {userId &&
          <div className="flex gap-6 items-center">
            {checkRole("admin") &&
              <Link href="/admin/dashboard">Dashboard</Link>
            }
            <UserButton />
          </div>
        }
      </nav>
    </header >
  )
}

export default Navbar