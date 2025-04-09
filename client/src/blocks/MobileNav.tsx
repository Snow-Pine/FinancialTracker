"use client"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from 'react-router-dom'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'


const MobileNav = () => {
    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <div className="flex justify-end">
                    <SheetTrigger>
                        <img
                            src="/icons/hamburger.svg"
                            width={30}
                            height={30}
                            alt="Menu"
                            className="cursor-pointer"
                        />
                    </SheetTrigger>
                </div>
                <SheetContent side="left" className="border-none bg-white">
                    <Link to="/" className="mb-12 cursor-pointer flex
                                            items-center gap-1 px-4">
                        <img
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="Spendr logo"
                        />
                        <h1 className="text-26 font-ibm-plex-serif font-bold
                                       text-black-1">
                            Spendr
                        </h1>
                    </Link>

                    <div className="mobilenav-sheet">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16
                                            text-white">
                                {sidebarLinks.map((item) => {

                                    const isActive =
                                        location.pathname === item.route ||
                                        location.pathname.startsWith(`${item.route}`);

                                    return (
                                        <SheetClose asChild key={item.route}>
                                            <Link
                                                to={item.route}
                                                key={item.label}
                                                className={cn('mobilenav-sheet_close w-full', { 'bg-bank-gradient': isActive })}>
                                                <img
                                                    src={item.imgURL}
                                                    alt={item.label}
                                                    width={20}
                                                    height={20}
                                                    className={cn({ 'brightness-[3] invert-0': isActive })}
                                                />
                                                <p className={cn('text-16 font-semibold text-black-2', { 'text-white': isActive })}>
                                                    {item.label}
                                                </p>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}

                                USER
                            </nav>
                        </SheetClose>
                        FOOTER
                    </div>


                </SheetContent>
            </Sheet>

        </section>
    )
}

export default MobileNav