'use client';

import type React from 'react';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import { OrganizationType } from '@/generated/prisma/enums';
import { OrganizationFormData, organizationSchema } from '@/lib/schemas';
import { updateOrganization } from '@/lib/data/update-organization';
import { Organization } from '@/generated/prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralSettingsProps {
    organization: Organization;
}

export default function GeneralSettings({ organization }: GeneralSettingsProps) {

    const [isPending, startTransition] = useTransition();

    // const [logoFile, setLogoFile] = useState<File | null>(null);
    // const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<OrganizationFormData>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: organization?.name || '',
            slug: organization?.slug || '',
            contactEmail: organization?.contactEmail || '',
            contactPhone: organization?.contactPhone || '',
            website: organization?.website || '',
            organizationType: organization?.organizationType ?? undefined,
        },
    });

    console.log('Form errors:', form.formState.errors);
    // const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const file = event.target.files?.[0];
    //   if (file) {
    //     if (file.size > 2 * 1024 * 1024) {
    //       // toast({
    //       //   title: "File too large",
    //       //   description: "Please select an image smaller than 2MB",
    //       //   variant: "destructive",
    //       // })
    //       return;
    //     }
    //     setLogoFile(file);
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setLogoPreview(reader.result as string);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // };

    function onSubmit(data: OrganizationFormData) {
        startTransition(async () => {
            if (!organization) return;
            try {
                await updateOrganization({ organizationId: organization.id, data });

                toast.success('Organization settings updated successfully');
            } catch (error) {
                toast.success('Failed to update organization settings');
            }
        });
    }
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">General Settings</h2>
                <p className="text-sm text-muted-foreground">
                    Manage your organization's basic information and settings.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>
                        View and update your organization's details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Logo Section */}
                            {/* <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              <Avatar className="h-16 w-16">
                <AvatarImage src={logoPreview || ''} alt="Organization logo" />
                <AvatarFallback className="text-lg font-semibold">
                  {organization?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById('logo-upload')?.click()
                    }
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Logo
                  </Button>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(organization?.logo);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB. Recommended: 200×200px
                </p>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div> */}

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organization Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter organization name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="organizationType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(OrganizationType).map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Organization Slug</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input
                                                        placeholder="organization-slug"
                                                        className="rounded-l-none"
                                                        {...field}
                                                    />
                                                    <span className="text-sm text-muted-foreground bg-muted px-3 py-2 border border-r-0 rounded-l-md">
                                                        .shiksha.cloud
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                Used in URLs. Only lowercase letters, numbers, and
                                                hyphens.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <h3 className="font-medium">Contact Information</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="admin@organization.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contactPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://www.organization.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
