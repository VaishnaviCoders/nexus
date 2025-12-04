// components/contact/ContactForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import z from "zod";

const contactSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    institudeName: z.string().min(2, {
        message: "School name must be at least 2 characters.",
    }),
    studentCount: z.string({
        required_error: "Please select student count.",
    }),
    message: z.string().optional(),
});

export default function ContactForm() {
    const [isPending, startTransition] = useTransition();


    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            institudeName: "",
            studentCount: "",
            message: "",
        },
    });

    const isSchoolNameFilled = (form.watch("institudeName") ?? "").trim().length > 0

    async function onSubmit(formData: z.infer<typeof contactSchema>) {
        startTransition(async () => {
            try {
                // API call logic here
                console.log(formData);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
                alert("Form submitted successfully!");
                form.reset();
            } catch (error) {
                console.error(error);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Principal Name"
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="principal@school.com"
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="institudeName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">School Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your School Name"
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isSchoolNameFilled &&
                    <FormField
                        control={form.control}
                        name="studentCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Number of Students</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="100-200">100-200 students</SelectItem>
                                        <SelectItem value="200-500">200-500 students</SelectItem>
                                        <SelectItem value="500-1000">500-1000 students</SelectItem>
                                        <SelectItem value="1000+">1000+ students</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Message (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about your school's needs..."
                                    className="min-h-[120px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    We'll get back to you within 24 hours
                </p>
            </form>
        </Form>
    );
}