"use client"

import { ReactNode, useState } from "react"
import Image from "next/image"
import MenuItem from "./menuItem"
import Logo from '../../public/1748511479814-572553117.png'
import Profile from '../../public/1748511479814-572553117.png'
import { removeCookie } from "@/lib/client-cookies"
import router from "next/router"

type MenuType = {
    id: string,
    icon: ReactNode
    path: string,
    label: string
}

type ManagerProp = {
    children: ReactNode,
    id: string,
    title: string,
    menuList: MenuType[]
}

const handleLogout = () => {
    removeCookie("token")
    removeCookie("id")
    removeCookie("name")
    removeCookie("role")
    router.replace("/login")
};

const Sidebar = ({ children, id, title, menuList }: ManagerProp) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <div className="w-full min-h-dvh bg-blue-400">
            {/* header section */}
            <header className="flex justify-between items-center p-4 mb-0 bg-primary shadow-md">
                <div className="flex gap-2">
                    <div>
                        <button onClick={() => setIsShow(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </button>
                    </div>
                    <h1 className="font-bold text-xl text-white">
                        {title}
                    </h1>
                </div>


                <div className="relative">
          
          
        </div>
            </header>
            {/* end header section */}
            <div className="p-4">
                {children}
            </div>
            <div className={`flex flex-col w-2/3 md:w-1/2 lg:w-1/4 h-full fixed top-0 right-full transition-transform z-50
           bg-blue-400 border-r border-primary ${isShow ? `translate-x-full` : ``}`}>

                {/* close button */}
                <div className="ml-auto p-2">
                    <button onClick={() => setIsShow(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
                {/* end close button */}

                {/* logo section */}
                <div className="mb-3 w-full flex justify-center">
                    <div className="flex items-center space-x-2">
                        <Image src={Logo} alt="Logo" width={40} height={40} />
                        <h1 className="text-2xl font-bold text-white-500">Baca Sendiri</h1>
                    </div>
                </div>
                {/* end logo section */}

                {/* user section */}
                <div className="w-full mt-10 mb-6 bg-primary text-white p-3 flex gap-2 items-center">
                    <Image src={Profile} alt="Profile" width={40} height={40} className="rounded-full" />
                    <div className="text-sm font-semibold">
                        Jangan Lupa Baca
                    </div>
                </div>
                {/* end user section */}

                {/* menu section */}
                <div className="w-full p-2 overflow-y-auto">
                    <div className="px-5">
                        {
                            menuList.map((menu, index) => (
                                <MenuItem icon={menu.icon} label={menu.label} path={menu.path} active={menu.id === id} key={`keyMenu${index}`} />
                            ))
                        }
                    </div>
                </div>
                {/* menu section */}

            </div>
            {/* end sidebar section */}

        </div>
    )
}
export default Sidebar
