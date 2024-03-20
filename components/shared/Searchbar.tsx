"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
interface Props {
    routeType: string;
}

function Searchbar({ routeType }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState("");

    // query after 0.3s of no input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                router.push(`/${routeType}?q=` + search);
            } else {
                router.push(`/${routeType}`);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, routeType]);
    const handleCreateGroup = () => {
        router.push('/groups/create');
    }


    return (
        <>
            <div className='searchbar'>
                <Image
                    src='/assets/search-gray.svg'
                    alt='search'
                    width={24}
                    height={24}
                    className='object-contain'
                />
                <Input
                    id='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`${routeType !== "/search" ? "Search support groups" : "Search mates"
                        }`}
                    className='no-focus searchbar_input'
                />
            </div>
            {routeType === "groups" ?
                (<Button className="bg-blue hover:bg-indigo-500 rounded-full"
                    onClick={handleCreateGroup}
                >
                    <p className=" text-subtle-medium text-light-1  ">new</p>
                </Button>) : null}
        </>
    );
}

export default Searchbar;