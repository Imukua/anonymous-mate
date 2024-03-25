"use client"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from '@/lib/validations/user';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import * as z from "zod"
import Image from 'next/image';
import { ChangeEvent, use, useState } from 'react';
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from '@/lib/utils';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        image: string;
        bio: string;
    }
    btnTitle: string;

}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");
    const pathname = usePathname();
    const router = useRouter();
    const form = useForm(
        {
            resolver: zodResolver(userValidation),
            defaultValues: {
                profile_photo: user?.image || "",
                name: user?.name || "",
                username: user?.username || "",
                bio: user?.bio || "",
            }
        }
    )


    const onSubmit = async (values: z.infer<typeof userValidation>) => {
        const blob = values.profile_photo;

        const hasChanged = isBase64Image(blob);

        if (hasChanged) {
            let imgRes;
            let retryCount = 0;

            while (retryCount < 2) {
                try {
                    imgRes = await startUpload(files);
                    break;
                } catch (error) {
                    console.error(`Attempt ${retryCount + 1} to upload image failed. Error: ${error}`);
                    retryCount++;
                }
            }

            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url;
            }

        }

        await updateUser({
            userId: user.id,
            name: values.name,
            username: values.username,
            bio: values.bio,
            picture: values.profile_photo,
            path: pathname
        });

        if (pathname === '/profile/edit') {
            router.back();
        } else {
            router.push('/');
        }

    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldchange: (vale: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) {
                console.log("file is not an image")
                return;
            }

            fileReader.onload = async (event) => {
                const imgdataUrl = event.target?.result?.toString() || "";
                fieldchange(imgdataUrl);
            };

            fileReader.readAsDataURL(file)
        }

    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='profile photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='profile photo'
                                        width={24}
                                        height={24}
                                        priority
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 test-base-semibold text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/'
                                    placeholder='upload a photo'
                                    className='account-form_image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                name
                            </FormLabel>
                            <FormControl className=''>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                username
                            </FormLabel>
                            <FormControl className=''>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />

                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                bio
                            </FormLabel>
                            <FormControl className=''>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='bg-primary-500'>Submit</Button>
            </form>
        </Form>

    )

}

export default AccountProfile;