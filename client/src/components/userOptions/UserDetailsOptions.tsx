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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
    roomName: z.string(),
    roomId: z.string(),
    senderId: z.string(),
    username: z.string()
})

type FormValues = z.infer<typeof formSchema>;

interface UserDetailsOptionsProps {
    handleNewUser: (values: FormValues) => void;
}

export default function UserDetailsOptions({ handleNewUser }: UserDetailsOptionsProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            senderId: crypto.randomUUID(),
            roomName: "",
            roomId: crypto.randomUUID(),
            username: ""
        }
    })

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
                                <Input
                                    placeholder="User123"
                                    {...field}
                                    onChange={field.onChange}
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                />
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
                    name="roomName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chat Room Name</FormLabel>
                            <Input
                                placeholder="Mithril-Rocks"
                                {...field}
                                onChange={field.onChange}
                                value={field.value || ''}
                                onBlur={field.onBlur}
                            />
                            <FormDescription>
                                This is the room name for your chat.
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
