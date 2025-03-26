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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Rooms } from "@/lib/types";
import { useEffect, useState } from "react";

const formSchema = z.object({
    userId: z.number(),
    roomId: z.coerce.number(),
    username: z.string()
})

type FormValues = z.infer<typeof formSchema>;

interface UserOptionsContainerProps {
    rooms: Rooms;
    handleNewUser: (values: FormValues) => void;
}

export default function UserOptionsContainer({ rooms, handleNewUser }: UserOptionsContainerProps) {

    const [localRooms, setLocalRooms] = useState<Rooms>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: Date.now(),
            roomId: 0,
            username: ""
        }
    })

    useEffect(() => {
        if (rooms && rooms.length > 0) {
            setLocalRooms(rooms)

            if (rooms.length > 0) {
                form.setValue('roomId', rooms[0].roomId)
            }
        }
    }, [rooms])

    const handleSubmit = (values: FormValues) => {
        handleNewUser(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="User123" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chat Room</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a room to join" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {localRooms &&
                                        localRooms.map((room) => (
                                            <SelectItem key={room.roomId} value={room.roomId.toString()}>{room.roomId}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                This is the room you will be assigned.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
