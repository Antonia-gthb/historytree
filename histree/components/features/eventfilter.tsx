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



interface EventfilterProps {
  items?: string[] | undefined,
  selectedItems: string[],
  onSubmit: (selected: string[]) => void
}

export function Eventfilter({ items = [], selectedItems, onSubmit }: EventfilterProps) {


  const form = useForm<{ items: string[] }>({
    defaultValues: { items: selectedItems },
  });

  useEffect(() => {
    form.reset({ items: selectedItems });
  }, [selectedItems, form]);

  function handleSubmit(data: { items: string[] }) {
    console.log("Selected mutations:", data.items)
    onSubmit(data.items)
  }




  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                  const isChecked = field.value?.includes(item) ?? false

                  return (
                    <FormItem
                      key={item}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value ?? []), item]
                              : (field.value ?? []).filter((i) => i !== item)

                            field.onChange(newValue)
                          }}
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
        <Button type="submit" className="ease-in-out hover:-translate-y-1">Submit</Button>
      </form>
    </Form>
  )
}      