import Image from "next/image"
import Link from "next/link"
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";

function TopBar() {
    return (
        <nav className="fixed top-0 z-30 flex w-full items-center justify-between rounded-t-3xl bg-glassmorphism  backdrop-blur-lg px-6 py-3 ">
            <Link href="/" className=" flex items-center gap-2">
                <Image src="/assets/next.svg" alt="logo" width={28} height={28} />
                <p className="text-sky-400">Anonymate</p>
            </Link>
            <div className="flex items-center">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

        </nav >
    )

}

export default TopBar