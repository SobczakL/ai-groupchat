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
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

type FormValues = z.infer<typeof formSchema>;

interface SignUpOptionsProps {
    handleNewUser: (values: FormValues) => void;
}

export default function SignUpOptions({ handleNewUser }: SignUpOptionsProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            userName: "",
            password: ""
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
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Jerry"
                                    {...field}
                                    onChange={field.onChange}
                                    value={field.value || ''}
                                    onBlur={field.onBlur}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                placeholder="Smith"
                                {...field}
                                onChange={field.onChange}
                                value={field.value || ''}
                                onBlur={field.onBlur}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <Input
                                placeholder="MithrilRocks"
                                {...field}
                                onChange={field.onChange}
                                value={field.value || ''}
                                onBlur={field.onBlur}
                            />
                            <FormDescription>
                                This is your publically displayed name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chat Room Name</FormLabel>
                            <Input
                                type="password"
                                placeholder="*******"
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
