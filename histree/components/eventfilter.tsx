"use client"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"


type FormValues = {
    items?: string[]
}

export function Eventfilter({ items }: FormValues) {
    const form = useForm<FormValues>({
        defaultValues: {
            items: items,
        },
    })

    function onSubmit() {
    }

    useEffect(() => {
        if (items && items.length > 0) {
          form.reset({
            items: items, // ✅ aktiviert alle Checkboxen nachträglich
          })
        }
      }, [items])
    

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Eventfilter</FormLabel>
                    <FormDescription>
                      Select the genetic events you want to see in the MHN History Tree
                    </FormDescription>
                  </div>
      
                  <div className="grid grid-cols-3 gap-4">
                    {items?.slice(1).map((item) => {
                      const isChecked = field.value?.includes(item)
      
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )
                    })}
                  </div>
      
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }      