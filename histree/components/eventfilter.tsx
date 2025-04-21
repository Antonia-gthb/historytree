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
  // alle verfügbaren Mutation‑Namen
  items?: string[] | undefined,
  // hier bekommt die Page die Selektion rein
  onSubmit: (selected: string[]) => void
}

export function Eventfilter({ items = [], onSubmit }: EventfilterProps) {
  
  const form = useForm<{ items: string[] }>({
    defaultValues: { items: [] },
  })

  function handleSubmit(data: { items: string[] }) {
    console.log("Selected mutations:", data.items)
    onSubmit(data.items)      // ← hier gibst du es an page.tsx weiter
  }

  useEffect(() => {
    if (items.length > 0) {
      form.reset({ items })
    }
  }, [items, form])


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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}      